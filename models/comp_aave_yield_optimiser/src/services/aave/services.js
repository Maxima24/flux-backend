"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcAaveAvailableLiquidity = calcAaveAvailableLiquidity;
exports.calcAaveBorrowUtilization = calcAaveBorrowUtilization;
exports.calcAaveSupplyUtilization = calcAaveSupplyUtilization;
exports.calcAaveSupplyUtilizationDerivative = calcAaveSupplyUtilizationDerivative;
exports.calcAaveSupplyUtilizationSecondDerivative = calcAaveSupplyUtilizationSecondDerivative;
exports.calcAaveBorrowRate = calcAaveBorrowRate;
exports.calcAaveBorrowRateDerivative = calcAaveBorrowRateDerivative;
exports.calcAaveBorrowRateSecondDerivative = calcAaveBorrowRateSecondDerivative;
exports.calcAaveSupplyRate = calcAaveSupplyRate;
exports.calcAaveSupplyRateDerivative = calcAaveSupplyRateDerivative;
exports.calcAaveSupplyRateSecondDerivative = calcAaveSupplyRateSecondDerivative;
exports.calcAaveThreshold = calcAaveThreshold;
exports.initConstants = initConstants;
var mathUtils_js_1 = require("../../utils/mathUtils.js");
var SECONDS_PER_YEAR = 31536000n;
var RAY = Math.pow(10n, 27n);
var WAD = Math.pow(10n, 18n);
var PERCENTAGE_FACTOR = 10000n;
function calcAaveAvailableLiquidity(x, params) {
    var virtualUnderlyingBalance = params.virtualUnderlyingBalance;
    return virtualUnderlyingBalance + x;
}
function calcAaveBorrowUtilization(x, params) {
    var totalDebt = params.totalDebt;
    return (0, mathUtils_js_1.rayDiv)(totalDebt, totalDebt + calcAaveAvailableLiquidity(x, params));
}
function calcAaveSupplyUtilization(x, params) {
    var totalDebt = params.totalDebt, unbacked = params.unbacked;
    return (0, mathUtils_js_1.rayDiv)(totalDebt, totalDebt + unbacked + calcAaveAvailableLiquidity(x, params));
}
function calcAaveSupplyUtilizationDerivative(x, params) {
    var totalDebt = params.totalDebt, decimals = params.decimals;
    var decimalsFactor = Math.pow(10n, decimals);
    var totalDebtRAY = (0, mathUtils_js_1.rayDiv)(totalDebt, decimalsFactor);
    var su = calcAaveSupplyUtilization(x, params);
    var mod = Math.pow(su, 2n) / totalDebtRAY;
    return -1n * mod;
}
function calcAaveSupplyUtilizationSecondDerivative(x, params) {
    var totalDebt = params.totalDebt, decimals = params.decimals;
    var decimalsFactor = Math.pow(10n, decimals);
    var totalDebtRAY = (0, mathUtils_js_1.rayDiv)(totalDebt, decimalsFactor);
    var su = calcAaveSupplyUtilization(x, params);
    return (2n * Math.pow(su, 3n)) / Math.pow(totalDebtRAY, 2n);
}
function calcAaveBorrowRate(x, params) {
    var variableRateSlope2 = params.variableRateSlope2, variableRateSlope1 = params.variableRateSlope1, baseVariableBorrowRate = params.baseVariableBorrowRate, optimalUsageRatio = params.optimalUsageRatio;
    var bu = calcAaveBorrowUtilization(x, params);
    if (bu == 0n) {
        return 0n;
    }
    else if (bu < optimalUsageRatio) {
        return (baseVariableBorrowRate + (variableRateSlope1 * bu) / optimalUsageRatio);
    }
    else {
        return (baseVariableBorrowRate +
            variableRateSlope1 +
            (variableRateSlope2 * (bu - optimalUsageRatio)) /
                (RAY - optimalUsageRatio));
    }
}
function calcAaveBorrowRateDerivative(x, params) {
    var variableRateSlope2 = params.variableRateSlope2, variableRateSlope1 = params.variableRateSlope1, optimalUsageRatio = params.optimalUsageRatio, totalDebt = params.totalDebt, decimals = params.decimals;
    var decimalsFactor = Math.pow(10n, decimals);
    var totalDebtRAY = (0, mathUtils_js_1.rayDiv)(totalDebt, decimalsFactor);
    var bu = calcAaveBorrowUtilization(x, params);
    if (bu < optimalUsageRatio) {
        return (((variableRateSlope1 * Math.pow(bu, 2n)) / (optimalUsageRatio * totalDebtRAY)) *
            -1n);
    }
    else {
        return (((variableRateSlope2 * Math.pow(bu, 2n)) /
            ((RAY - optimalUsageRatio) * totalDebtRAY)) *
            -1n);
    }
}
function calcAaveBorrowRateSecondDerivative(x, params) {
    var variableRateSlope2 = params.variableRateSlope2, variableRateSlope1 = params.variableRateSlope1, optimalUsageRatio = params.optimalUsageRatio, totalDebt = params.totalDebt, decimals = params.decimals;
    var decimalsFactor = Math.pow(10n, decimals);
    var totalDebtRAY = (0, mathUtils_js_1.rayDiv)(totalDebt, decimalsFactor);
    var bu = calcAaveBorrowUtilization(x, params);
    if (bu < optimalUsageRatio) {
        return ((variableRateSlope1 * 2n * Math.pow(bu, 3n)) /
            (optimalUsageRatio * Math.pow(totalDebtRAY, 2n)));
    }
    else {
        return ((variableRateSlope2 * 2n * Math.pow(bu, 3n)) /
            ((RAY - optimalUsageRatio) * Math.pow(totalDebtRAY, 2n)));
    }
}
function calcAaveSupplyRate(x, params) {
    var reserveMultiple = params.reserveMultiple;
    var su = calcAaveSupplyUtilization(x, params);
    var br = calcAaveBorrowRate(x, params);
    return (0, mathUtils_js_1.percentMul)((0, mathUtils_js_1.rayMul)(su, br), reserveMultiple);
}
function calcAaveSupplyRateDerivative(x, params) {
    var reserveMultiple = params.reserveMultiple;
    var br = calcAaveBorrowRate(x, params);
    var brd = calcAaveBorrowRateDerivative(x, params);
    var su = calcAaveSupplyUtilization(x, params);
    var sud = calcAaveSupplyUtilizationDerivative(x, params);
    return (0, mathUtils_js_1.percentMul)((0, mathUtils_js_1.rayMul)(br, sud) + (0, mathUtils_js_1.rayMul)(su, brd), reserveMultiple);
}
function calcAaveSupplyRateSecondDerivative(x, params) {
    var reserveMultiple = params.reserveMultiple;
    var br = calcAaveBorrowRate(x, params);
    var brd = calcAaveBorrowRateDerivative(x, params);
    var brsd = calcAaveBorrowRateSecondDerivative(x, params);
    var su = calcAaveSupplyUtilization(x, params);
    var sud = calcAaveSupplyUtilizationDerivative(x, params);
    var susd = calcAaveSupplyUtilizationSecondDerivative(x, params);
    var curveRate = (0, mathUtils_js_1.rayMul)(brsd, su);
    var interaction = (0, mathUtils_js_1.rayMul)(2n * brd, sud);
    var curveUtil = (0, mathUtils_js_1.rayMul)(susd, br);
    return (0, mathUtils_js_1.percentMul)(curveRate + interaction + curveUtil, reserveMultiple);
}
function calcAaveThreshold(params) {
    var totalDebt = params.totalDebt, optimalUsageRatio = params.optimalUsageRatio, virtualUnderlyingBalance = params.virtualUnderlyingBalance;
    var num = totalDebt * (RAY - optimalUsageRatio) -
        optimalUsageRatio * virtualUnderlyingBalance;
    return num / optimalUsageRatio;
}
function initConstants(params) {
    var totalScaledVariableDebt = params.totalScaledVariableDebt, reserveFactor = params.reserveFactor, virtualUnderlyingBalance = params.virtualUnderlyingBalance, unbacked = params.unbacked, decimals = params.decimals, variableRateSlope2 = params.variableRateSlope2, variableRateSlope1 = params.variableRateSlope1, baseVariableBorrowRate = params.baseVariableBorrowRate, optimalUsageRatio = params.optimalUsageRatio;
    var _a = updatedCurrentIndexesAave(params), _ = _a[0], updatedBorrowIndex = _a[1];
    var totalDebt = (0, mathUtils_js_1.rayMul)(updatedBorrowIndex, totalScaledVariableDebt);
    var reserveMultiple = PERCENTAGE_FACTOR - reserveFactor;
    return {
        variableRateSlope1: variableRateSlope1,
        variableRateSlope2: variableRateSlope2,
        baseVariableBorrowRate: baseVariableBorrowRate,
        unbacked: unbacked,
        decimals: decimals,
        optimalUsageRatio: optimalUsageRatio,
        virtualUnderlyingBalance: virtualUnderlyingBalance,
        totalDebt: totalDebt,
        reserveMultiple: reserveMultiple,
    };
}
function updatedCurrentIndexesAave(_a) {
    var lastUpdateTimestamp = _a.lastUpdateTimestamp, variableBorrowIndex = _a.variableBorrowIndex, variableBorrowRate = _a.variableBorrowRate, totalScaledVariableDebt = _a.totalScaledVariableDebt, liquidityIndex = _a.liquidityIndex, liquidityRate = _a.liquidityRate;
    var currentTimestamp = BigInt(Math.floor(Date.now() / 1000));
    var timeElapsed = currentTimestamp - BigInt(lastUpdateTimestamp);
    var updatedSupplyIndex = liquidityIndex;
    if (liquidityRate != 0n) {
        var linearInterestFactor = RAY + (liquidityRate * timeElapsed) / SECONDS_PER_YEAR;
        updatedSupplyIndex = (0, mathUtils_js_1.rayMul)(linearInterestFactor, liquidityIndex);
    }
    var updatedBorrowIndex = variableBorrowIndex;
    if (totalScaledVariableDebt != 0n) {
        var compoundedInterestFactor = void 0;
        if (timeElapsed == 0n) {
            compoundedInterestFactor = RAY;
        }
        else {
            var x = (variableBorrowRate * timeElapsed) / SECONDS_PER_YEAR;
            compoundedInterestFactor =
                RAY + x + (0, mathUtils_js_1.rayMul)(x, x / 2n + (0, mathUtils_js_1.rayMul)(x, x / 6n));
        }
        updatedBorrowIndex = (0, mathUtils_js_1.rayMul)(compoundedInterestFactor, variableBorrowIndex);
    }
    return [updatedSupplyIndex, updatedBorrowIndex];
}
