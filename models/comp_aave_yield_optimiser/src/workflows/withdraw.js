"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.witdrawalOptimalWorkflow = void 0;
var langgraph_1 = require("@langchain/langgraph");
var newton_js_1 = require("./newton.js");
var methods_js_1 = require("../services/aave/methods.js");
var services_js_1 = require("../services/aave/services.js");
var methods_js_2 = require("../services/compound/methods.js");
var services_js_2 = require("../services/compound/services.js");
var rangeUtils_js_1 = require("../utils/rangeUtils.js");
var computeFx_js_1 = require("../services/computeFunctions/computeFx.js");
var computePxandPcxPrime_js_1 = require("../services/computeFunctions/computePxandPcxPrime.js");
var mathUtils_js_1 = require("../utils/mathUtils.js");
var methods_js_3 = require("../services/ERC20/methods.js");
var ethers_1 = require("ethers");
var withdrawWorkflowState = langgraph_1.Annotation.Root({
    agentAddress: (langgraph_1.Annotation),
    withdrawAmount: (langgraph_1.Annotation),
    withdrawableAmount: (langgraph_1.Annotation),
    balances: (langgraph_1.Annotation),
    assetMetaData: (langgraph_1.Annotation),
    aaveConstants: (langgraph_1.Annotation),
    compConstants: (langgraph_1.Annotation),
    maxValuesInRanges: (0, langgraph_1.Annotation)({
        default: function () { return []; },
        reducer: function (a, b) { return a.concat(b); },
    }),
    transactions: (langgraph_1.Annotation),
});
var fetchBalances = function (state) { return __awaiter(void 0, void 0, void 0, function () {
    var assetMetaData, atokenAddress, compPoolAddress, assetAddress, idleBalance, compBalance, aaveBalance, balances;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                assetMetaData = state.assetMetaData;
                atokenAddress = assetMetaData.atokenAddress, compPoolAddress = assetMetaData.compPoolAddress, assetAddress = assetMetaData.assetAddress;
                return [4 /*yield*/, (0, methods_js_3.getUserAssetBalance)(assetAddress, state.agentAddress)];
            case 1:
                idleBalance = _a.sent();
                return [4 /*yield*/, (0, methods_js_3.getUserAssetBalance)(compPoolAddress, state.agentAddress)];
            case 2:
                compBalance = _a.sent();
                return [4 /*yield*/, (0, methods_js_3.getUserAssetBalance)(atokenAddress, state.agentAddress)];
            case 3:
                aaveBalance = _a.sent();
                balances = { idleBalance: idleBalance, compBalance: compBalance, aaveBalance: aaveBalance };
                return [2 /*return*/, { balances: balances }];
        }
    });
}); };
var adjustIdleBalance = function (state) {
    var balances = state.balances, withdrawAmount = state.withdrawAmount;
    var idleBalance = balances.idleBalance;
    var withdrawableAmount = 0n;
    if (idleBalance < withdrawAmount) {
        // increase withdrawable amunt
        withdrawableAmount += idleBalance;
        // reduce withdraw Amount
        withdrawAmount -= idleBalance;
    }
    else {
        withdrawableAmount = withdrawAmount;
        // send withdrawal from  idle balance
        var transactions = [["TransferIdle", withdrawableAmount]];
        // end workflow and return trnsactions
        return new langgraph_1.Command({
            update: { withdrawableAmount: withdrawableAmount, transactions: transactions },
            goto: langgraph_1.END,
        });
    }
    return new langgraph_1.Command({
        update: { withdrawableAmount: withdrawableAmount, withdrawAmount: withdrawAmount },
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
var fetchAaveDetails = function (state) { return __awaiter(void 0, void 0, void 0, function () {
    var data, aaveConstants;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, methods_js_1.getDetailsAave)(state.assetMetaData)];
            case 1:
                data = _a.sent();
                aaveConstants = (0, services_js_1.initConstants)(data);
                return [2 /*return*/, { aaveConstants: aaveConstants }];
        }
    });
}); };
/**
 *Gets the aave details/constants and updates the state
 *
 * @param state  The current Workflow state
 *
 *
 * @returns compConstants   Updated
 */
var fetchCompDetails = function (state) { return __awaiter(void 0, void 0, void 0, function () {
    var compConstants;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, methods_js_2.getDetailsCompound)(state.assetMetaData)];
            case 1:
                compConstants = _a.sent();
                return [2 /*return*/, { compConstants: compConstants }];
        }
    });
}); };
//F(x) = ((A -x)U(-x) + (C + (-(W -x))) k(-(W -x)))/(A +C + W)
/**
 *Derives the respective regions by the boundaries  and initiate a region worker for each region
 *
 * @param state The current Workflow state
 *
 *
 * @returns returns  inRangeWorkers for each boundary
 */ //W - C <= x <=A
var initiateRangeeWorkers = function (state) {
    var aaveConstants = state.aaveConstants, compConstants = state.compConstants, assetMetaData = state.assetMetaData, withdrawAmount = state.withdrawAmount;
    var _a = state.balances, aaveBalance = _a.aaveBalance, compBalance = _a.compBalance;
    //W - C <= x <=A
    var maxWithdrawalAave = (0, mathUtils_js_1.min)(aaveBalance, aaveConstants.virtualUnderlyingBalance);
    var maxWithdrawalComp = (0, mathUtils_js_1.min)(compBalance, compConstants.availableLiquidity);
    withdrawAmount = (0, mathUtils_js_1.min)(withdrawAmount, maxWithdrawalAave + maxWithdrawalComp);
    var upperBound = maxWithdrawalAave;
    var lowerBound = withdrawAmount - maxWithdrawalComp;
    var superBound = [lowerBound, upperBound];
    var compThreshold = (0, services_js_2.calcCompThreshold)(compConstants);
    var aaveThreshold = (0, services_js_1.calcAaveThreshold)(aaveConstants);
    var ranges = (0, rangeUtils_js_1.deriveRanges)(aaveThreshold, compThreshold);
    var edges = ranges
        .map(function (range) { return (0, rangeUtils_js_1.innerBoundary)(superBound, range); })
        .filter(rangeUtils_js_1.validRange);
    var params = {
        A: aaveBalance,
        C: compBalance,
        W: withdrawAmount,
        decimals: assetMetaData.decimals,
        aaveConstants: aaveConstants,
        compConstants: compConstants,
    };
    var computeFxofX = function (x) {
        return (0, computeFx_js_1.computeFxWithdrawal)(__assign(__assign({}, params), { x: x }));
    };
    var computePxAndPxPrimeofX = function (x) {
        return (0, computePxandPcxPrime_js_1.computePxAndPxPrimeWithdrawal)(__assign(__assign({}, params), { x: x }));
    };
    var sends = edges.map(function (edge) {
        return instantiateWorker(edge, __assign(__assign({}, params), { computeFxofX: computeFxofX, computePxAndPxPrimeofX: computePxAndPxPrimeofX }));
    });
    return new langgraph_1.Command({
        update: { withdrawAmount: withdrawAmount },
        goto: sends,
    });
};
var getMaxValueWithinRange = function (state) { return __awaiter(void 0, void 0, void 0, function () {
    var iterationCount, maxValuesInRanges;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                iterationCount = 15;
                return [4 /*yield*/, newton_js_1.newtonRapshonWorkflow.invoke(__assign(__assign({}, state), { iterationCount: iterationCount }))];
            case 1:
                maxValuesInRanges = (_a.sent()).maxValuesInRanges;
                return [2 /*return*/, { maxValuesInRanges: maxValuesInRanges }];
        }
    });
}); };
var generateTransactions = function (state) {
    var _a;
    var maxValuesInRanges = state.maxValuesInRanges, withdrawAmount = state.withdrawAmount, withdrawableAmount = state.withdrawableAmount;
    //@ts-ignore
    var _b = maxValuesInRanges[0], xMax = _b[0], fxMax = _b[1];
    for (var i = 1; i < maxValuesInRanges.length; i++) {
        //@ts-ignore
        var _c = maxValuesInRanges[i], xi = _c[0], fxI = _c[1];
        if (fxI > fxMax) {
            _a = [xi, fxI], xMax = _a[0], fxMax = _a[1];
        }
    }
    console.log("The optimal resultant supply Rate is  " + (0, ethers_1.formatUnits)(fxMax, 27));
    withdrawableAmount += withdrawAmount;
    var optimalDeltaAave = -xMax;
    var optimalDeltaCompound = xMax - withdrawAmount;
    var transactions = orderWithdrawalTransactions(optimalDeltaAave, optimalDeltaCompound, withdrawableAmount);
    return { transactions: transactions };
};
exports.witdrawalOptimalWorkflow = new langgraph_1.StateGraph(withdrawWorkflowState)
    .addNode("fetchAaveDetails", fetchAaveDetails, {
    retryPolicy: { maxAttempts: 4 },
})
    .addNode("fetchCompDetails", fetchCompDetails, {
    retryPolicy: { maxAttempts: 4 },
})
    .addNode("checkIdleBalance", adjustIdleBalance, {
    ends: [langgraph_1.END, "fetchConstants"],
})
    .addNode("fetchConstants", function (state) {
    return {};
})
    .addNode("fetchBalances", fetchBalances)
    .addNode("initiateRangeWorkers", initiateRangeeWorkers, {
    // This node dynamically dispatches to workers via Send
    ends: ["getMaxValueWithinRange"],
})
    .addNode("getMaxValueWithinRange", getMaxValueWithinRange)
    .addNode("generateTransactions", generateTransactions)
    .addEdge(langgraph_1.START, "fetchBalances")
    .addEdge("fetchBalances", "checkIdleBalance")
    .addEdge("fetchConstants", "fetchCompDetails")
    .addEdge("fetchConstants", "fetchAaveDetails")
    .addEdge("fetchAaveDetails", "initiateRangeWorkers")
    .addEdge("fetchCompDetails", "initiateRangeWorkers")
    // No static edge from initiateRangeWorkers - Send handles routing dynamically
    .addEdge("getMaxValueWithinRange", "generateTransactions")
    .addEdge("generateTransactions", langgraph_1.END)
    .compile();
/// Utilities
function orderWithdrawalTransactions(optimalDeltaAave, optimalDeltaCompound, withdrawableAmount) {
    var transactions = [];
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
    var computeFxofX = params.computeFxofX, computePxAndPxPrimeofX = params.computePxAndPxPrimeofX;
    var xFactor = Math.pow(10n, params.decimals);
    var pxFactor = Math.pow(10n, 27n);
    var computeFxoflower = computeFxofX(edge[0]);
    var computeFxofhigher = computeFxofX(edge[1]);
    var x0;
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
    var invariants = {
        edge: edge,
        xFactor: xFactor,
        pxFactor: pxFactor,
        computeFxofX: computeFxofX,
        computePxAndPxPrimeofX: computePxAndPxPrimeofX,
        x0: x0,
    };
    return new langgraph_1.Send("getMaxValueWithinRange", {
        invariants: invariants,
        maxValuesInRanges: [],
    });
}
