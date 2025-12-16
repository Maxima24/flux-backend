import {
  Annotation,
  Command,
  END,
  Send,
  START,
  StateGraph,
} from "@langchain/langgraph";

import { newtonRapshonWorkflow } from "./newton.js";
import type { AaveProtocolConstants } from "../services/aave/types.js";
import type { CompoundProtocolConstants } from "../services/compound/types.js";
import { getDetailsAave } from "../services/aave/methods.js";
import { calcAaveThreshold, initConstants } from "../services/aave/services.js";
import { getDetailsCompound } from "../services/compound/methods.js";
import { calcCompThreshold } from "../services/compound/services.js";
import {
  deriveRanges,
  innerBoundary,
  validRange,
} from "../utils/rangeUtils.js";
import { computeFxDepositRabalance as computeFx } from "../services/computeFunctions/computeFx.js";
import { computePxAndPxPrimeDepositOrRebalance as computePxAndPxPrime } from "../services/computeFunctions/computePxandPcxPrime.js";
import { min } from "../utils/mathUtils.js";
import type { AssetMetaData, balancesParams } from "../types.js";
import type { NewtonRalphFlowState, PxInvariants } from "./newton.js";
import { formatUnits } from "ethers";
import type { Transaction } from "../types.js";
import { getUserAssetBalance } from "../services/ERC20/methods.js";

const depositWorkflowState = Annotation.Root({
  agentAddress: Annotation<string>,
  balances: Annotation<balancesParams>,
  assetMetaData: Annotation<AssetMetaData>,
  aaveConstants: Annotation<AaveProtocolConstants>,
  compConstants: Annotation<CompoundProtocolConstants>,
  maxValuesInRanges: Annotation<[bigint, bigint][]>({
    default: () => [],
    reducer: (a, b) => a.concat(b),
  }),
  transactions: Annotation<Transaction[]>,
});

type DepositWorkflowState = typeof depositWorkflowState.State;

const fetchBalances = async (state: DepositWorkflowState) => {
  const { assetMetaData } = state;

  const { atokenAddress, compPoolAddress, assetAddress } = assetMetaData;

  const idleBalance = await getUserAssetBalance(
    assetAddress,
    state.agentAddress
  );
  const compBalance = await getUserAssetBalance(
    compPoolAddress,
    state.agentAddress
  );
  const aaveBalance = await getUserAssetBalance(
    atokenAddress,
    state.agentAddress
  );

  const balances: balancesParams = { idleBalance, compBalance, aaveBalance };

  return { balances };
};

/**
 * Gets the aave details/ constants and updates updates the state
 *
 * @param state  The current Workflow state
 *
 * @returns aaveConstants   Updated
 */
const fetchAaveDetails = async (state: DepositWorkflowState) => {
  let data = await getDetailsAave(state.assetMetaData);

  let aaveConstants: AaveProtocolConstants = initConstants(data);

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
const fetchCompDetails = async (state: DepositWorkflowState) => {
  let compConstants: CompoundProtocolConstants = await getDetailsCompound(
    state.assetMetaData
  );

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
const initiateRangeWorkers = (state: DepositWorkflowState) => {
  const { aaveConstants, compConstants, assetMetaData } = state;

  let { idleBalance, aaveBalance, compBalance } = state.balances;
  // -A <= x<= C + W
  let lowerBound = -min(aaveBalance, aaveConstants.virtualUnderlyingBalance);

  let upperBound =
    min(compBalance, compConstants.availableLiquidity) + idleBalance;

  let superBound: [bigint, bigint] = [lowerBound, upperBound];

  let compThreshold = calcCompThreshold(compConstants);

  let aaveThreshold = calcAaveThreshold(aaveConstants);

  let ranges: [bigint, bigint][] = deriveRanges(aaveThreshold, compThreshold);

  let edges = ranges
    .map((range: [bigint, bigint]) => innerBoundary(superBound, range))
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

  let computeFxofX = (x: bigint): bigint => {
    return computeFx({
      ...params,
      x,
    });
  };

  let computePxAndPxPrimeofX = (x: bigint): [bigint, bigint] => {
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

const getMaxValueWithinRange = async (state: NewtonRalphFlowState) => {
  const iterationCount = 15;

  let { maxValuesInRanges } = await newtonRapshonWorkflow.invoke({
    ...state,
    iterationCount,
  });

  return { maxValuesInRanges };
};

const generateTransactions = (state: DepositWorkflowState) => {
  const {
    maxValuesInRanges,
    balances: { idleBalance },
  } = state;

  //@ts-ignore
  let [xMax, fxMax]: [bigint, bigint] = maxValuesInRanges[0];

  for (let i = 1; i < maxValuesInRanges.length; i++) {
    //@ts-ignore
    let [xi, fxI]: [bigint, bigint] = maxValuesInRanges[i];

    if (fxI > fxMax) {
      [xMax, fxMax] = [xi, fxI];
    }
  }

  console.log(
    "The optimal resultant supply Rate is  " + formatUnits(fxMax, 27)
  );

  const optimalDeltaAave = xMax;

  const optimalDeltaCompound = idleBalance - optimalDeltaAave;

  const transactions = orderDepositRebalanceTransactions(
    optimalDeltaAave,
    optimalDeltaCompound
  );

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
  .addNode("getOptimalDelta", generateTransactions)
  .addEdge(START, "fetchAaveDetails")
  .addEdge(START, "fetchCompDetails")
  .addEdge(START, "fetchBalances")
  .addEdge("fetchAaveDetails", "initiateRangeWorkers")
  .addEdge("fetchCompDetails", "initiateRangeWorkers")
  .addEdge("fetchBalances", "initiateRangeWorkers")
  .addEdge("getMaxValueWithinRange", "getOptimalDelta")
  .addEdge("getOptimalDelta", END)
  .compile();

/// Utils
function orderDepositRebalanceTransactions(
  optimalDeltaAave: bigint,
  optimalDeltaCompound: bigint
): Transaction[] {
  let transactions: Transaction[] = [];

  if (optimalDeltaAave > 0n && optimalDeltaCompound > 0n) {
    transactions.concat([
      ["DepositAave", optimalDeltaAave],
      ["DepositCompound", optimalDeltaCompound],
    ]);
  } else if (optimalDeltaAave < 0n) {
    // NOTE optimalDeltaAave and optimalDeltaCompound can't both be negative
    // for depositing and rebalancing
    transactions.concat([
      ["WithdrawAave", optimalDeltaAave],
      ["DepositCompound", optimalDeltaCompound],
    ]);
  } else {
    transactions.concat([
      ["WithdrawCompound", optimalDeltaCompound],
      ["DepositAave", optimalDeltaAave],
    ]);
  }

  return transactions;
}

type InitiateWorkerParams = {
  A: bigint;
  C: bigint;
  W: bigint;
  decimals: bigint;
  computeFxofX: (x: bigint) => bigint;
  computePxAndPxPrimeofX: (x: bigint) => [bigint, bigint];
};

function instantiateWorker(
  edge: [bigint, bigint],
  params: InitiateWorkerParams
): Send {
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
  } else {
    //starts closer to edge 1,since its sultion is more close to edge[1]
    x0 = edge[1] - (edge[1] - edge[0]) / 3n;
  }

  //let x0 = (edge[0] + edge[1]) / 2n;

  let invariants: PxInvariants = {
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
