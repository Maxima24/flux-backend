import { Annotation, Command, END, Send, START, StateGraph, } from "@langchain/langgraph";
import { newtonRapshonWorkflow } from "./newton.js";
import { getDetailsAave } from "../services/aave/methods.js";
import { calcAaveSupplyRate, calcAaveThreshold, initConstants, } from "../services/aave/services.js";
import { getDetailsCompound } from "../services/compound/methods.js";
import { calcCompSupplyRate, calcCompThreshold, } from "../services/compound/services.js";
import { deriveRanges, innerBoundary, validRange, } from "../utils/rangeUtils.js";
import { computeFxDepositRabalance as computeFx } from "../services/computeFunctions/computeFx.js";
import { computePxAndPxPrimeDepositOrRebalance as computePxAndPxPrime } from "../services/computeFunctions/computePxandPcxPrime.js";
import { min } from "../utils/mathUtils.js";
import { formatUnits, parseUnits } from "ethers";
import { getUserAssetBalance } from "../services/ERC20/methods.js";
import { AaveV3Polygon } from "@bgd-labs/aave-address-book";
const depositWorkflowState = Annotation.Root({
    agentAddress: (Annotation),
    balances: (Annotation),
    assetMetaData: (Annotation),
    aaveConstants: (Annotation),
    compConstants: (Annotation),
    maxValuesInRanges: Annotation({
        default: () => [],
        reducer: (a, b) => a.concat(b),
    }),
    transactions: (Annotation),
});
const fetchBalances = async (state) => {
    // const { assetMetaData } = state;
    // const { atokenAddress, compPoolAddress, assetAddress } = assetMetaData;
    const idleBalance = parseUnits("2000", 6); //await getUserAssetBalance(
    //   assetAddress,
    //   state.agentAddress
    // );
    const compBalance = parseUnits("100000", 6); // await getUserAssetBalance(
    //   compPoolAddress,
    //   state.agentAddress
    // );
    const aaveBalance = parseUnits("100000", 6); //await getUserAssetBalance(
    //   atokenAddress,
    //   state.agentAddress
    // );
    const balances = { idleBalance, compBalance, aaveBalance };
    return { balances };
};
/**
 * Gets the aave details/ constants and updates updates the state
 *
 * @param state  The current Workflow state
 *
 * @returns aaveConstants   Updated
 */
const fetchAaveDetails = async (state) => {
    console.log(".... fetching aave details");
    let data = await getDetailsAave(state.assetMetaData);
    let aaveConstants = initConstants(data);
    return { aaveConstants };
};
/**
 *Gets the aave details/constants and updates the state
 *
 * @param state  The current Workflow state
 *
 *
 * @returns compConstants   Updated
 */
const fetchCompDetails = async (state) => {
    console.log(".....fetching Compound details");
    let compConstants = await getDetailsCompound(state.assetMetaData);
    return { compConstants };
};
/**
 *Derives the respective regions by the boundaries  and initiate a region worker for each region
 *
 * @param state The current Workflow state
 *
 *
 * @returns returns  inRangeWorkers for each boundary
 */
const initiateRangeWorkers = (state) => {
    const { aaveConstants, compConstants, assetMetaData } = state;
    let { idleBalance, aaveBalance, compBalance } = state.balances;
    // -A <= x<= C + W
    let lowerBound = -min(aaveBalance, aaveConstants.virtualUnderlyingBalance);
    let upperBound = min(compBalance, compConstants.availableLiquidity) + idleBalance;
    let superBound = [lowerBound, upperBound];
    let compThreshold = calcCompThreshold(compConstants);
    let aaveThreshold = calcAaveThreshold(aaveConstants);
    let ranges = deriveRanges(aaveThreshold, compThreshold);
    let edges = ranges
        .map((range) => innerBoundary(superBound, range))
        .filter(validRange);
    console.log("The edges are " + edges);
    let params = {
        A: aaveBalance,
        C: compBalance,
        W: idleBalance,
        decimals: assetMetaData.decimals,
        aaveConstants,
        compConstants,
    };
    let computeFxofX = (x) => {
        return computeFx({
            ...params,
            x,
        });
    };
    let computePxAndPxPrimeofX = (x) => {
        return computePxAndPxPrime({
            ...params,
            x,
        });
    };
    let sends = edges.map((edge) => {
        return instantiateWorker(edge, {
            ...params,
            computeFxofX,
            computePxAndPxPrimeofX,
        });
    });
    return new Command({
        goto: sends,
    });
};
const getMaxValueWithinRange = async (state) => {
    const iterationCount = 15;
    let { maxValuesInRanges } = await newtonRapshonWorkflow.invoke({
        ...state,
        iterationCount,
    });
    console.log("The max values in ranges are " + maxValuesInRanges);
    return { maxValuesInRanges };
};
const generateTransactions = (state) => {
    const { maxValuesInRanges, balances: { idleBalance }, } = state;
    //@ts-ignore
    let [xMax, fxMax] = maxValuesInRanges[0];
    for (let i = 1; i < maxValuesInRanges.length; i++) {
        //@ts-ignore
        let [xi, fxI] = maxValuesInRanges[i];
        if (fxI > fxMax) {
            [xMax, fxMax] = [xi, fxI];
        }
    }
    console.log("The optimal  delta is " +
        xMax +
        " and the resultant supply Rate is  " +
        formatUnits(fxMax, 27));
    const optimalDeltaAave = xMax;
    const optimalDeltaCompound = idleBalance - optimalDeltaAave;
    console.log("The optimal compundDelta is " + optimalDeltaCompound);
    const transactions = orderDepositRebalanceTransactions(optimalDeltaAave, optimalDeltaCompound);
    return { transactions };
};
export const depositOptimalWorkflow = new StateGraph(depositWorkflowState)
    .addNode("fetchAaveDetails", fetchAaveDetails, {
    retryPolicy: { maxAttempts: 4 },
})
    .addNode("fetchCompDetails", fetchCompDetails, {
    retryPolicy: { maxAttempts: 4 },
})
    .addNode("fetchBalances", fetchBalances, {
    retryPolicy: { maxAttempts: 4 },
})
    .addNode("initiateRangeWorkers", initiateRangeWorkers, {
    // This node dynamically dispatches to workers via Send
    ends: ["getMaxValueWithinRange"],
})
    .addNode("getMaxValueWithinRange", getMaxValueWithinRange)
    .addNode("generateTransactions", generateTransactions)
    .addEdge(START, "fetchAaveDetails")
    .addEdge(START, "fetchCompDetails")
    .addEdge(START, "fetchBalances")
    .addEdge("fetchAaveDetails", "initiateRangeWorkers")
    .addEdge("fetchCompDetails", "initiateRangeWorkers")
    .addEdge("fetchBalances", "initiateRangeWorkers")
    .addEdge("getMaxValueWithinRange", "generateTransactions")
    .addEdge("generateTransactions", END)
    .compile();
/// Utils
function orderDepositRebalanceTransactions(optimalDeltaAave, optimalDeltaCompound) {
    let transactions = [];
    if (optimalDeltaAave > 0n && optimalDeltaCompound > 0n) {
        transactions = [
            ["DepositAave", optimalDeltaAave],
            ["DepositCompound", optimalDeltaCompound],
        ];
    }
    else if (optimalDeltaAave < 0n) {
        // NOTE optimalDeltaAave and optimalDeltaCompound can't both be negative
        // for depositing and rebalancing
        transactions = [
            ["WithdrawAave", optimalDeltaAave],
            ["DepositCompound", optimalDeltaCompound],
        ];
    }
    else {
        transactions = [
            ["WithdrawCompound", optimalDeltaCompound],
            ["DepositAave", optimalDeltaAave],
        ];
    }
    return transactions;
}
function instantiateWorker(edge, params) {
    let { computeFxofX, computePxAndPxPrimeofX } = params;
    let xFactor = 10n ** params.decimals;
    let pxFactor = 10n ** 27n; // RAY
    let computeFxoflower = computeFxofX(edge[0]);
    let computeFxofhigher = computeFxofX(edge[1]);
    let x0;
    // better algorithm is needed for initial guess
    if (computeFxoflower > computeFxofhigher) {
        //starts closer to edge 0,since its solution is more close to edge[0]
        // x0 = edge[0] + (edge[1] - edge[0]) / 3n;
        x0 = edge[0];
    }
    else {
        //starts closer to edge 1,since its sultion is more close to edge[1]
        x0 = edge[1] - (edge[1] - edge[0]) / 3n;
    }
    //let x0 = (edge[0] + edge[1]) / 2n;
    let invariants = {
        edge,
        xFactor,
        pxFactor,
        computeFxofX,
        computePxAndPxPrimeofX,
        x0,
    };
    return new Send("getMaxValueWithinRange", {
        invariants,
        maxValuesInRanges: [],
    });
}
let assetMetaData = {
    symbol: "USDC",
    decimals: 6n,
    atokenAddress: AaveV3Polygon.ASSETS.USDC.A_TOKEN,
    aavePoolAddress: "",
    compPoolAddress: "0xF25212E676D1F7F89Cd72fFEe66158f541246445",
    assetAddress: AaveV3Polygon.ASSETS.USDC.UNDERLYING,
};
let result = await depositOptimalWorkflow.invoke({ assetMetaData });
let { compConstants, aaveConstants, transactions, balances } = result;
let amount = parseUnits("2000", 6);
let params = {
    A: 0n,
    C: 0n,
    W: balances.idleBalance,
    decimals: 6n,
    aaveConstants,
    compConstants,
};
let currentSupplyRateAave = calcAaveSupplyRate(0n, aaveConstants);
console.log("The current supply rate on aave is " + formatUnits(currentSupplyRateAave, 27));
let supplyRateOnlyuAave = computeFx({ ...params, x: amount });
console.log("The  resulting supply rate for depositing only on aave is " +
    formatUnits(supplyRateOnlyuAave, 27));
let currentSupplyRateCompound = calcCompSupplyRate(0n, compConstants);
console.log("The current supply rate for compound is " +
    formatUnits(currentSupplyRateCompound, 18));
let supplyrateOnlyCompound = computeFx({ ...params, x: 0n });
console.log("The  resulting supply rate for depositing only on compound is " +
    formatUnits(supplyrateOnlyCompound, 27));
let wupplyRateInbetween = computeFx({ ...params, x: amount / 2n });
console.log("The supply rate for depositing equally is  " +
    formatUnits(wupplyRateInbetween, 27));
console.log("The supply rate only for compound is " +
    formatUnits(supplyrateOnlyCompound, 27));
console.log("The transactions are   " + transactions);
//   let compConstants: CompoundProtocolConstants = await getDetailsCompound(
//     assetMetaData
//   );
//   let data = await getDetailsAave(assetMetaData);
//   let aaveConstants: AaveProtocolConstants = initConstants(data);
//   let params = {
//     A: 0n,
//     C: 0n,
//     W: parseUnits("2000000", 6), // 2 million tokens
//     decimals: 6n,
//     aaveConstants,
//     compConstants,
//   };
//   let computeFxofX = (x: bigint): bigint => {
//     return computeFx({
//       ...params,
//       x,
//     });
//   };
//   let computePxAndPxPrimeofX = (x: bigint): [bigint, bigint] => {
//     return computePxAndPxPrime({
//       ...params,
//       x,
//     });
//   };
//   let xFactor = 10n ** 6n;
//   let pxFactor = 10n ** 27n;
//   const edge: [bigint, bigint] = [0n, params.W];
//   const x0 = (edge[0] + edge[1]) / 2n;
//   let invariants: PxInvariants = {
//     edge,
//     xFactor,
//     pxFactor,
//     computeFxofX,
//     computePxAndPxPrimeofX,
//     x0,
//   };
//   const iterationCount = 15;
//   let result = await newtonRapshonWorkflow.invoke({
//     invariants,
//     iterationCount,
//     maxValuesInRanges: [],
//   });
//   console.log(result.maxValuesInRanges);
// };
// testValue();
//# sourceMappingURL=depositRebalance.js.map