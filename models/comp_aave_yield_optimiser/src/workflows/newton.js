"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newtonRapshonWorkflow = exports.newtonRalphWorkflowState = void 0;
var langgraph_1 = require("@langchain/langgraph");
var groq_1 = require("@langchain/groq");
var mathUtils_js_1 = require("../utils/mathUtils.js");
var rangeUtils_js_1 = require("../utils/rangeUtils.js");
exports.newtonRalphWorkflowState = langgraph_1.Annotation.Root({
    invariants: (langgraph_1.Annotation),
    iterationCount: (langgraph_1.Annotation),
    Xterms: (langgraph_1.Annotation),
    maxValuesInRanges: (0, langgraph_1.Annotation)({
        default: function () { return []; },
        reducer: function (a, b) { return a.concat(b); },
    }),
});
function initX0(state) {
    var invariants = state.invariants;
    var x0 = invariants.x0, computePxAndPxPrimeofX = invariants.computePxAndPxPrimeofX;
    var _a = computePxAndPxPrimeofX(x0), px0 = _a[0], px0Prime = _a[1];
    var Xterms = [[x0, px0, px0Prime]];
    var goto = "nextApproximate";
    if (px0 == 0n || px0Prime >= 0n) {
        goto = "getMaxFx";
    }
    return new langgraph_1.Command({
        update: { Xterms: Xterms },
        goto: goto,
    });
}
// start --> shouldProceed--- aggregator <---> llm check  aggrator <--jump--> nextApproximate
function llmCheck(state) {
    return __awaiter(this, void 0, void 0, function () {
        var Xterms, iterationCount, invariants, goto, extraIteration, xFactor, pxFactor;
        return __generator(this, function (_a) {
            Xterms = state.Xterms, iterationCount = state.iterationCount, invariants = state.invariants;
            goto = "nextApproximate";
            extraIteration = 0;
            if (Xterms.length >= iterationCount) {
                console.log("____ doing am llm checks ");
                goto = "getMaxFx";
                xFactor = invariants.xFactor, pxFactor = invariants.pxFactor;
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
            return [2 /*return*/, new langgraph_1.Command({
                    update: { iterationCount: iterationCount },
                    goto: goto,
                })];
        });
    });
}
function nextApproximate(state) {
    console.log("__geting next approximate");
    var Xterms = state.Xterms, invariants = state.invariants;
    var computePxAndPxPrimeofX = invariants.computePxAndPxPrimeofX, computeFxofX = invariants.computeFxofX, xFactor = invariants.xFactor, pxFactor = invariants.pxFactor, edge = invariants.edge;
    //@ts-ignore
    var _a = Xterms[Xterms.length - 1], xN = _a[0], pxN = _a[1], pxNPrime = _a[2];
    // const xFactor = 10n ** aaveConstants.decimals;
    var h = (0, mathUtils_js_1.factorDiv)((0, mathUtils_js_1.factorMul)(pxN, xFactor, pxFactor), pxNPrime, pxFactor); // in xFactor
    var xNext;
    if (h == 0n) {
        xNext = (xN * pxNPrime - pxN * xFactor) / pxNPrime;
    }
    else {
        xNext = xN - h;
    }
    // if next value is still x and
    if (xN == xNext || (0, rangeUtils_js_1.isOutsideRange)(xNext, edge)) {
        return new langgraph_1.Command({
            goto: "getMaxFx",
        });
    }
    var _b = computePxAndPxPrimeofX(xNext), pxNext = _b[0], pxNextPrime = _b[1];
    Xterms = Xterms.concat([[xNext, pxNext, pxNextPrime]]);
    var goto = "llmCheck";
    if (pxNext == 0n || pxNextPrime >= 0n) {
        goto = "getMaxFx";
    }
    return new langgraph_1.Command({ update: { Xterms: Xterms }, goto: goto });
}
function getMaxFx(state) {
    var _a;
    var Xterms = state.Xterms, invariants = state.invariants, maxValuesInRanges = state.maxValuesInRanges;
    var computeFxofX = invariants.computeFxofX, edge = invariants.edge;
    var bestApprox = Xterms[Xterms.length - 1];
    var vals = edge;
    if (bestApprox) {
        vals = vals.concat([bestApprox[0]]);
    }
    //@ts-ignore
    var xMax = vals[0];
    var fxMax = computeFxofX(xMax);
    for (var i = 1; i < vals.length; i++) {
        //@ts-ignore
        var xI = vals[i];
        var fxI = computeFxofX(xI);
        if (fxI > fxMax) {
            _a = [xI, fxI], xMax = _a[0], fxMax = _a[1];
        }
    }
    maxValuesInRanges = [[xMax, fxMax]];
    return { maxValuesInRanges: maxValuesInRanges };
}
exports.newtonRapshonWorkflow = new langgraph_1.StateGraph(exports.newtonRalphWorkflowState)
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
    .addEdge(langgraph_1.START, "initX0")
    .addEdge("getMaxFx", langgraph_1.END)
    .compile()
    .withConfig({ recursionLimit: 200 });
var model = new groq_1.ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
});
var structuredModel = model; //.withStructuredOutput(llmSchema);
var modelPrompt = "You are a Numerical Analysis Expert specializing in Newton-Raphson convergence analysis.\n\n## YOUR TASK\nAnalyze Newton-Raphson iteration data to determine:\n1. Whether the method is converging\n2. How many additional iterations are needed\n\n## INPUT FORMAT\nYou receive:\n- `data`: Array of [xi, f(xi), f'(xi)] for each iteration\n- `xFactor`: Scaling factor for x values (actual_x = xi / xFactor)\n- `fxFactor`: Scaling factor for f(x) values (actual_f = f(xi) / fxFactor)\n\nExample:\n```json\n{\n  \"data\": [[1000, 2.5, 3.0], [833, 0.416, 3.6], [819, 0.016, 3.66]],\n  \"xFactor\": 1000,\n  \"fxFactor\": 1e27\n}\n```\n\n## SCALING RELATIONSHIPS\n- **Actual x**: actual_x = xi_scaled / xFactor\n- **Actual f(x)**: actual_f = f_scaled / fxFactor\n- **Actual f'(x)**: actual_fprime = fprime_scaled / fxFactor\n\nLarge factors mean actual values are tiny:\n- fxFactor = 1e27 and f_scaled = 1.5 \u2192 actual_f = 1.5e-27\n- xFactor = 1000 and x_scaled = 1000 \u2192 actual_x = 1.0\n\n## ANALYSIS STEPS\n\n### 1. Convert to Actual Values\nConvert all scaled values to actual values for meaningful analysis.\n\n### 2. Check Convergence Pattern\nCompute differences: \u0394x_actual(i) = |x_i - x_{i-1}|\n\n**Converging if:**\n- \u0394x values are decreasing\n- f(x) values are approaching zero\n- Changes are becoming progressively smaller\n\n### 3. Assess Function Values\nCheck if |f_actual| < 1e-12 (or appropriate threshold for problem)\n\n### 4. Evaluate Convergence Rate\nFor quadratic convergence: ratio = \u0394x_{i+1} / (\u0394x_i)^2 should stabilize\n\n### 5. Determine Remaining Iterations\n\n**If converging:**\n- Already precise: 0-1 iterations\n- Good progress: 1-3 iterations  \n- Slow progress: 3-5 iterations\n- Maximum: 10 iterations\n\n**If NOT converging:**\n- Return 0 iterations\n- Check for: oscillation, divergence, or near-zero derivative\n\n## CONVERGENCE THRESHOLDS\n\nAdapt based on scaling:\n- **X-convergence**: \u0394x_scaled < xFactor \u00D7 1e-8\n- **F-convergence**: |f_scaled| < fxFactor \u00D7 1e-12\n\n## SPECIAL CASES\n\n**Large fxFactor (1e18+):**\n- Actual f(x) values are extremely small\n- Even moderate scaled values indicate good convergence\n- Focus on x-convergence\n\n**Large xFactor (1e9+):**\n- Actual x values are small\n- Scaled differences need careful interpretation\n\n**Newton step scaling:**\n- Step size in scaled units: \u0394x_scaled \u221D xFactor/fxFactor\n- Extreme ratios (< 1e-12 or > 1e12) may cause issues\n\n## OUTPUT FORMAT\nReturn ONLY valid JSON (no markdown, no backticks):\n{\n  \"isConverging\": true,\n  \"extraIterationCount\": 2\n}\n\n## DECISION GUIDELINES\n\n**Converging (isConverging: true):**\n- Monotonic decrease in errors\n- f(x) approaching zero\n- Reasonable progress each iteration\n\n**Iteration counts:**\n- 0: Already at desired precision\n- 1-2: Very close, minor refinement\n- 3-5: Good progress, moderate refinement needed\n- 5-10: Slower convergence, more work needed\n- 0 (if not converging): Method failing\n\nBe pragmatic: recommend iterations that provide meaningful improvement given the current precision level.";
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
