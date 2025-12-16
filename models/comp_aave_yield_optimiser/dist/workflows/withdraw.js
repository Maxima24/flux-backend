import { Annotation, Command, END, Send, START, StateGraph, } from "@langchain/langgraph";
import { newtonRalphWorkflowState, newtonRapshonWorkflow } from "./newton.js";
import { getDetailsAave } from "../services/aave/methods.js";
import { calcAaveThreshold, initConstants } from "../services/aave/services.js";
import { getDetailsCompound } from "../services/compound/methods.js";
import { calcCompThreshold } from "../services/compound/services.js";
import { deriveRanges, innerBoundary, validRange, } from "../utils/rangeUtils.js";
import { computeFxWithdrawal as computeFx } from "../services/computeFunctions/computeFx.js";
import { computePxAndPxPrimeWithdrawal as computePxAndPxPrime } from "../services/computeFunctions/computePxandPcxPrime.js";
import { min } from "../utils/mathUtils.js";
import { getUserAssetBalance } from "../services/ERC20/methods.js";
import { formatUnits, id } from "ethers";
const withdrawWorkflowState = Annotation.Root({
    agentAddress: (Annotation),
    withdrawAmount: (Annotation),
    withdrawableAmount: (Annotation),
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
    const { assetMetaData } = state;
    const { atokenAddress, compPoolAddress, assetAddress } = assetMetaData;
    const idleBalance = await getUserAssetBalance(assetAddress, state.agentAddress);
    const compBalance = await getUserAssetBalance(compPoolAddress, state.agentAddress);
    const aaveBalance = await getUserAssetBalance(atokenAddress, state.agentAddress);
    const balances = { idleBalance, compBalance, aaveBalance };
    return { balances };
};
const adjustIdleBalance = (state) => {
    let { balances, withdrawAmount } = state;
    let { idleBalance } = balances;
    let withdrawableAmount = 0n;
    if (idleBalance < withdrawAmount) {
        // increase withdrawable amunt
        withdrawableAmount += idleBalance;
        // reduce withdraw Amount
        withdrawAmount -= idleBalance;
    }
    else {
        withdrawableAmount = withdrawAmount;
        // send withdrawal from  idle balance
        const transactions = [["TransferIdle", withdrawableAmount]];
        // end workflow and return trnsactions
        return new Command({
            update: { withdrawableAmount, transactions },
            goto: END,
        });
    }
    return new Command({
        update: { withdrawableAmount, withdrawAmount },
        goto: "fetchConstants",
    });
};
/**
 * Gets the aave details/ constants and updates updates the state
 *
 * @param state  The current Workflow state
 *
 * @returns aaveConstants   Updated
 */
const fetchAaveDetails = async (state) => {
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
    let compConstants = await getDetailsCompound(state.assetMetaData);
    return { compConstants };
};
//F(x) = ((A -x)U(-x) + (C + (-(W -x))) k(-(W -x)))/(A +C + W)
/**
 *Derives the respective regions by the boundaries  and initiate a region worker for each region
 *
 * @param state The current Workflow state
 *
 *
 * @returns returns  inRangeWorkers for each boundary
 */ //W - C <= x <=A
const initiateRangeeWorkers = (state) => {
    let { aaveConstants, compConstants, assetMetaData, withdrawAmount } = state;
    let { aaveBalance, compBalance } = state.balances;
    //W - C <= x <=A
    const maxWithdrawalAave = min(aaveBalance, aaveConstants.virtualUnderlyingBalance);
    const maxWithdrawalComp = min(compBalance, compConstants.availableLiquidity);
    withdrawAmount = min(withdrawAmount, maxWithdrawalAave + maxWithdrawalComp);
    let upperBound = maxWithdrawalAave;
    let lowerBound = withdrawAmount - maxWithdrawalComp;
    let superBound = [lowerBound, upperBound];
    let compThreshold = calcCompThreshold(compConstants);
    let aaveThreshold = calcAaveThreshold(aaveConstants);
    let ranges = deriveRanges(aaveThreshold, compThreshold);
    let edges = ranges
        .map((range) => innerBoundary(superBound, range))
        .filter(validRange);
    let params = {
        A: aaveBalance,
        C: compBalance,
        W: withdrawAmount,
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
        update: { withdrawAmount },
        goto: sends,
    });
};
const getMaxValueWithinRange = async (state) => {
    const iterationCount = 15;
    let { maxValuesInRanges } = await newtonRapshonWorkflow.invoke({
        ...state,
        iterationCount,
    });
    return { maxValuesInRanges };
};
const generateTransactions = (state) => {
    let { maxValuesInRanges, withdrawAmount, withdrawableAmount } = state;
    //@ts-ignore
    let [xMax, fxMax] = maxValuesInRanges[0];
    for (let i = 1; i < maxValuesInRanges.length; i++) {
        //@ts-ignore
        let [xi, fxI] = maxValuesInRanges[i];
        if (fxI > fxMax) {
            [xMax, fxMax] = [xi, fxI];
        }
    }
    console.log("The optimal resultant supply Rate is  " + formatUnits(fxMax, 27));
    withdrawableAmount += withdrawAmount;
    const optimalDeltaAave = -xMax;
    const optimalDeltaCompound = xMax - withdrawAmount;
    const transactions = orderWithdrawalTransactions(optimalDeltaAave, optimalDeltaCompound, withdrawableAmount);
    return { transactions };
};
export const witdrawalOptimalWorkflow = new StateGraph(withdrawWorkflowState)
    .addNode("fetchAaveDetails", fetchAaveDetails, {
    retryPolicy: { maxAttempts: 4 },
})
    .addNode("fetchCompDetails", fetchCompDetails, {
    retryPolicy: { maxAttempts: 4 },
})
    .addNode("checkIdleBalance", adjustIdleBalance, {
    ends: [END, "fetchConstants"],
})
    .addNode("fetchConstants", (state) => {
    return {};
})
    .addNode("fetchBalances", fetchBalances)
    .addNode("initiateRangeWorkers", initiateRangeeWorkers, {
    // This node dynamically dispatches to workers via Send
    ends: ["getMaxValueWithinRange"],
})
    .addNode("getMaxValueWithinRange", getMaxValueWithinRange)
    .addNode("generateTransactions", generateTransactions)
    .addEdge(START, "fetchBalances")
    .addEdge("fetchBalances", "checkIdleBalance")
    .addEdge("fetchConstants", "fetchCompDetails")
    .addEdge("fetchConstants", "fetchAaveDetails")
    .addEdge("fetchAaveDetails", "initiateRangeWorkers")
    .addEdge("fetchCompDetails", "initiateRangeWorkers")
    // No static edge from initiateRangeWorkers - Send handles routing dynamically
    .addEdge("getMaxValueWithinRange", "generateTransactions")
    .addEdge("generateTransactions", END)
    .compile();
/// Utilities
function orderWithdrawalTransactions(optimalDeltaAave, optimalDeltaCompound, withdrawableAmount) {
    let transactions = [];
    if (optimalDeltaAave < 0n) {
        transactions.push(["WithdrawAave", optimalDeltaAave]);
        // withdraw that amount
    }
    if (optimalDeltaCompound < 0n) {
        transactions.push(["WithdrawCompound", optimalDeltaCompound]);
    }
    transactions.push(["TransferIdle", withdrawableAmount]);
    if (optimalDeltaAave > 0n) {
        transactions.push(["DepositAave", optimalDeltaAave]);
    }
    else if (optimalDeltaCompound > 0n) {
        transactions.push(["DepositCompound", optimalDeltaCompound]);
    }
    return transactions;
}
function instantiateWorker(edge, params) {
    let { computeFxofX, computePxAndPxPrimeofX } = params;
    let xFactor = 10n ** params.decimals;
    let pxFactor = 10n ** 27n;
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
//# sourceMappingURL=withdraw.js.map