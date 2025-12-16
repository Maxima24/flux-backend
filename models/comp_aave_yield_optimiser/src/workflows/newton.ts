import {
  Annotation,
  Command,
  END,
  START,
  StateGraph,
} from "@langchain/langgraph";

import { ChatGroq } from "@langchain/groq";
import { factorDiv, factorMul } from "../utils/mathUtils.js";
import { isOutsideRange } from "../utils/rangeUtils.js";

export type PxInvariants = {
  x0: bigint;
  xFactor: bigint;
  pxFactor: bigint;
  edge: [bigint, bigint];
  computePxAndPxPrimeofX: ComputePxAndPxPrime;
  computeFxofX: ComputeFx;
};

type ComputePxAndPxPrime = (x: bigint) => [bigint, bigint];

type ComputeFx = (x: bigint) => bigint;

export const newtonRalphWorkflowState = Annotation.Root({
  invariants: Annotation<PxInvariants>,
  iterationCount: Annotation<number>,
  Xterms: Annotation<Array<[bigint, bigint, bigint]>>,
  maxValuesInRanges: Annotation<[bigint, bigint][]>({
    default: () => [],
    reducer: (a, b) => a.concat(b),
  }),
});

export type NewtonRalphFlowState = typeof newtonRalphWorkflowState.State;

function initX0(state: NewtonRalphFlowState) {
  let { invariants } = state;
  const { x0, computePxAndPxPrimeofX } = invariants;

  let [px0, px0Prime] = computePxAndPxPrimeofX(x0);

  let Xterms: [bigint, bigint, bigint][] = [[x0, px0, px0Prime]];

  let goto = "nextApproximate";

  if (px0 == 0n || px0Prime >= 0n) {
    goto = "getMaxFx";
  }

  return new Command({
    update: { Xterms },
    goto,
  });
}

// start --> shouldProceed--- aggregator <---> llm check  aggrator <--jump--> nextApproximate

async function llmCheck(state: NewtonRalphFlowState) {
  let { Xterms, iterationCount, invariants } = state;

  let goto = "nextApproximate";

  let extraIteration = 0;

  if (Xterms.length >= iterationCount) {
    console.log("____ doing am llm checks ");

    goto = "getMaxFx";

    let { xFactor, pxFactor } = invariants;

    // try {
    //   let response = await structuredModel.invoke([
    //     {
    //       role: "system",
    //       content: modelPrompt,
    //     },
    //     {
    //       role: "user",
    //       content: `data:${Xterms} ,xFactor:${xFactor} ,fxFactor:${pxFactor}`,
    //     },
    //   ]);
    //   // Extract JSON from response (handle possible markdown code blocks)
    //   let jsonStr = response.content;

    //   // Remove markdown code blocks if present
    //   jsonStr = jsonStr
    //     //@ts-ignore
    //     .replace(/```json\n?/g, "")
    //     .replace(/```\n?/g, "")
    //     .trim();

    //   // Parse the JSON
    //   //@ts-ignore
    //   const feedback = JSON.parse(jsonStr);

    //   let { isConverging, extraIterationCount } = feedback;

    //   // console.log(
    //   //   "The extra count needed is  " +
    //   //     extraIterationCount +
    //   //     " and the sequnce of x is " +
    //   //     isConverging
    //   // );

    //   if (!isConverging || extraIterationCount == 0) {
    //     goto = "getMaxFx";
    //   } else {
    //     extraIteration = extraIterationCount;
    //   }
    // } catch (error) {
    //   goto = "getMaxFx";
    // }
  }

  iterationCount += extraIteration;
  return new Command({
    update: { iterationCount },
    goto,
  });

  // return { iterationCount };
}

function nextApproximate(state: NewtonRalphFlowState) {
  console.log("__geting next approximate");
  let { Xterms, invariants } = state;

  const { computePxAndPxPrimeofX, computeFxofX, xFactor, pxFactor, edge } =
    invariants;
  //@ts-ignore
  let [xN, pxN, pxNPrime]: [bigint, bigint, bigint] = Xterms[Xterms.length - 1];

  // const xFactor = 10n ** aaveConstants.decimals;

  const h = factorDiv(factorMul(pxN, xFactor, pxFactor), pxNPrime, pxFactor); // in xFactor

  let xNext: bigint;

  if (h == 0n) {
    xNext = (xN * pxNPrime - pxN * xFactor) / pxNPrime;
  } else {
    xNext = xN - h;
  }

  // if next value is still x and
  if (xN == xNext || isOutsideRange(xNext, edge)) {
    return new Command({
      goto: "getMaxFx",
    });
  }

  let [pxNext, pxNextPrime] = computePxAndPxPrimeofX(xNext);

  Xterms = Xterms.concat([[xNext, pxNext, pxNextPrime]]);

  let goto = "llmCheck";

  if (pxNext == 0n || pxNextPrime >= 0n) {
    goto = "getMaxFx";
  }

  return new Command({ update: { Xterms }, goto });
}

function getMaxFx(state: NewtonRalphFlowState) {
  let { Xterms, invariants, maxValuesInRanges } = state;

  const { computeFxofX, edge } = invariants;

  const bestApprox = Xterms[Xterms.length - 1];

  let vals = edge as bigint[];

  if (bestApprox) {
    vals = vals.concat([bestApprox[0]]);
  }

  //@ts-ignore
  let xMax: bigint = vals[0];
  let fxMax = computeFxofX(xMax);

  for (let i = 1; i < vals.length; i++) {
    //@ts-ignore
    let xI: bigint = vals[i];

    let fxI: bigint = computeFxofX(xI);

    if (fxI > fxMax) {
      [xMax, fxMax] = [xI, fxI];
    }
  }

  maxValuesInRanges = [[xMax, fxMax]];

  return { maxValuesInRanges };
}

export const newtonRapshonWorkflow = new StateGraph(newtonRalphWorkflowState)
  .addNode("initX0", initX0, {
    ends: ["getMaxFx", "nextApproximate"],
  })
  .addNode("llmCheck", llmCheck, {
    retryPolicy: { maxAttempts: 5 },
    ends: ["getMaxFx", "nextApproximate"],
  })
  .addNode("nextApproximate", nextApproximate, {
    ends: ["getMaxFx", "llmCheck"],
  })
  .addNode("getMaxFx", getMaxFx)
  .addEdge(START, "initX0")
  .addEdge("getMaxFx", END)
  .compile()
  .withConfig({ recursionLimit: 200 });

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
});

const structuredModel = model; //.withStructuredOutput(llmSchema);

const modelPrompt = `You are a Numerical Analysis Expert specializing in Newton-Raphson convergence analysis.

## YOUR TASK
Analyze Newton-Raphson iteration data to determine:
1. Whether the method is converging
2. How many additional iterations are needed

## INPUT FORMAT
You receive:
- \`data\`: Array of [xi, f(xi), f'(xi)] for each iteration
- \`xFactor\`: Scaling factor for x values (actual_x = xi / xFactor)
- \`fxFactor\`: Scaling factor for f(x) values (actual_f = f(xi) / fxFactor)

Example:
\`\`\`json
{
  "data": [[1000, 2.5, 3.0], [833, 0.416, 3.6], [819, 0.016, 3.66]],
  "xFactor": 1000,
  "fxFactor": 1e27
}
\`\`\`

## SCALING RELATIONSHIPS
- **Actual x**: actual_x = xi_scaled / xFactor
- **Actual f(x)**: actual_f = f_scaled / fxFactor
- **Actual f'(x)**: actual_fprime = fprime_scaled / fxFactor

Large factors mean actual values are tiny:
- fxFactor = 1e27 and f_scaled = 1.5 → actual_f = 1.5e-27
- xFactor = 1000 and x_scaled = 1000 → actual_x = 1.0

## ANALYSIS STEPS

### 1. Convert to Actual Values
Convert all scaled values to actual values for meaningful analysis.

### 2. Check Convergence Pattern
Compute differences: Δx_actual(i) = |x_i - x_{i-1}|

**Converging if:**
- Δx values are decreasing
- f(x) values are approaching zero
- Changes are becoming progressively smaller

### 3. Assess Function Values
Check if |f_actual| < 1e-12 (or appropriate threshold for problem)

### 4. Evaluate Convergence Rate
For quadratic convergence: ratio = Δx_{i+1} / (Δx_i)^2 should stabilize

### 5. Determine Remaining Iterations

**If converging:**
- Already precise: 0-1 iterations
- Good progress: 1-3 iterations  
- Slow progress: 3-5 iterations
- Maximum: 10 iterations

**If NOT converging:**
- Return 0 iterations
- Check for: oscillation, divergence, or near-zero derivative

## CONVERGENCE THRESHOLDS

Adapt based on scaling:
- **X-convergence**: Δx_scaled < xFactor × 1e-8
- **F-convergence**: |f_scaled| < fxFactor × 1e-12

## SPECIAL CASES

**Large fxFactor (1e18+):**
- Actual f(x) values are extremely small
- Even moderate scaled values indicate good convergence
- Focus on x-convergence

**Large xFactor (1e9+):**
- Actual x values are small
- Scaled differences need careful interpretation

**Newton step scaling:**
- Step size in scaled units: Δx_scaled ∝ xFactor/fxFactor
- Extreme ratios (< 1e-12 or > 1e12) may cause issues

## OUTPUT FORMAT
Return ONLY valid JSON (no markdown, no backticks):
{
  "isConverging": true,
  "extraIterationCount": 2
}

## DECISION GUIDELINES

**Converging (isConverging: true):**
- Monotonic decrease in errors
- f(x) approaching zero
- Reasonable progress each iteration

**Iteration counts:**
- 0: Already at desired precision
- 1-2: Very close, minor refinement
- 3-5: Good progress, moderate refinement needed
- 5-10: Slower convergence, more work needed
- 0 (if not converging): Method failing

Be pragmatic: recommend iterations that provide meaningful improvement given the current precision level.`;

// async function testValue() {
//   let xFactor = 10n ** 5n;

//   let pxFactor = xFactor;

//   let edge: [bigint, bigint] = [xFactor, 3n * xFactor];
//   let x0 = 2n * xFactor;
//   let computePxAndPxPrimeofX = (x: bigint): [bigint, bigint] => {
//     let px = x ** 3n / xFactor ** 2n - 3n * x - 4n * xFactor;

//     let pxPrime = (3n * x ** 2n) / xFactor - 3n * xFactor;

//     return [px, pxPrime];
//   };

//   let computeFxofX = (x: bigint): bigint => {
//     return x;
//   };

//   let invariants: PxInvariants = {
//     x0,
//     pxFactor,
//     xFactor,
//     computeFxofX,
//     computePxAndPxPrimeofX,
//     edge,
//   };

//   let iterationCount = 3;

//   let maxValuesInRanges: [bigint, bigint][] = [];

//   let state = await newtonRapshonWorkflow.invoke({
//     invariants,
//     iterationCount,
//     maxValuesInRanges,
//   });

//   console.log(state.Xterms);
// }

// testValue();

// let testState = {
//   aaveConstants: {
//     variableRateSlope1: 90000000000000000000000000n,
//     variableRateSlope2: 100000000000000000000000000n,
//     baseVariableBorrowRate: 0n,
//     unbacked: 0n,
//     decimals: 6n,
//     optimalUsageRatio: 900000000000000000000000000n,
//     virtualUnderlyingBalance: 17917177907027n,
//     totalDebt: 27417809298651n,
//     reserveMultiple: 8000n,
//   },
//   compConstants: {
//     decimals: 6n,
//     totalBorrow: 3661432239249n,
//     totalSupply: 5203078981191n,
//     availableLiquidity: 1982075661350n,
//     supplyKink: 900000000000000000n,
//     supplyPerSecondInterestRateBase: 0n,
//     supplyPerSecondInterestRateSlopeHigh: 101344495180n,
//     supplyPerSecondInterestRateSlopeLow: 1141552511n,
//   },
// };
