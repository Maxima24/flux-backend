"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computePxAndPxPrimeDepositOrRebalance = computePxAndPxPrimeDepositOrRebalance;
exports.computePxAndPxPrimeWithdrawal = computePxAndPxPrimeWithdrawal;
var convert_js_1 = require("../../utils/convert.js");
var services_js_1 = require("../aave/services.js");
var mathUtils_js_1 = require("../../utils/mathUtils.js");
var services_js_2 = require("../compound/services.js");
/**
 * Computes P(x) and P'(x)
 *
 * where
 *
 * P(x)= U(x) - K(W-x) +(A + x)U'(x) - (C + W -x)K'(W-x)
 *
 * and
 *
 * P'(x) = 2U'(x) + 2K'(W-x) + (A + x)U"(x)  + (C + W -x)K"(W-x)
 *
 *
 * @returns [P(x),P'(x)] where both values are in Ray factor
 */
function computePxAndPxPrimeDepositOrRebalance(params) {
    var A = params.A, C = params.C, W = params.W, x = params.x, aaveConstants = params.aaveConstants, compConstants = params.compConstants, decimals = params.decimals;
    var aaveBalanceDelta = x;
    var aaveSupplyRate = (0, services_js_1.calcAaveSupplyRate)(aaveBalanceDelta, aaveConstants);
    var aaveSupplyRateDerivative = (0, services_js_1.calcAaveSupplyRateDerivative)(aaveBalanceDelta, aaveConstants);
    var aaveSupplyRateSecondDerivative = (0, services_js_1.calcAaveSupplyRateSecondDerivative)(aaveBalanceDelta, aaveConstants);
    var compBalanceDelta = W - x;
    var compSupplyRate = (0, convert_js_1.wadToRay)((0, services_js_2.calcCompSupplyRate)(compBalanceDelta, compConstants));
    var compSupplyRateDerivative = (0, convert_js_1.wadToRay)((0, services_js_2.calcCompSupplyRateDerivative)(compBalanceDelta, compConstants));
    var compSupplyRateSecondDerivative = (0, convert_js_1.wadToRay)((0, services_js_2.calcCompSupplyRateSecondDerivative)(compBalanceDelta, compConstants));
    var decimalFactor = Math.pow(10n, decimals);
    var netBalanceAfterAave = (0, convert_js_1.toRay)(A + aaveBalanceDelta, decimalFactor);
    var netBalanceAfterComp = (0, convert_js_1.toRay)(C + compBalanceDelta, decimalFactor);
    //P(x) = U(x) - K(W-x) +(A + x)U'(x) - (C + W -x)K'(W-x)
    var rateNetSums = aaveSupplyRate - compSupplyRate;
    var px = rateNetSums +
        (0, mathUtils_js_1.rayMul)(netBalanceAfterAave, aaveSupplyRateDerivative) -
        (0, mathUtils_js_1.rayMul)(netBalanceAfterComp, compSupplyRateDerivative);
    var rateDerivativeSum = aaveSupplyRateDerivative + compSupplyRate;
    // return fx;
    //P'(x) =2U'(x) + 2K'(W-x) + (A + x)U"(x)  + (C + W -x)K"(W-x)
    var pxPrime = 2n * rateDerivativeSum +
        (0, mathUtils_js_1.rayMul)(netBalanceAfterAave, aaveSupplyRateSecondDerivative) +
        (0, mathUtils_js_1.rayMul)(netBalanceAfterComp, compSupplyRateSecondDerivative);
    return [px, pxPrime];
}
/**
 * Computes P(x) and P'(x)
 *
 * where
 *
 * -P(x)= P(x) = K(x-W) - U(-x)  + (C +  (x - W))k'(x -W)) - (A - x)U'(-x)
 *
 * and
 *
 * P'(x) =2K'(x-W) + 2U'(-x) + (C+ (x-W))K"(x-W) + (A-x)U"(-x)
 *
 *
 * @returns  [P(x),P'(x)] where both values are in Ray factor
 */
function computePxAndPxPrimeWithdrawal(params) {
    var A = params.A, C = params.C, W = params.W, x = params.x, aaveConstants = params.aaveConstants, compConstants = params.compConstants, decimals = params.decimals;
    var aaveBalanceDelta = -x;
    var aaveSupplyRate = (0, services_js_1.calcAaveSupplyRate)(aaveBalanceDelta, aaveConstants);
    var aaveSupplyRateDerivative = (0, services_js_1.calcAaveSupplyRateDerivative)(aaveBalanceDelta, aaveConstants);
    var aaveSupplyRateSecondDerivative = (0, services_js_1.calcAaveSupplyRateSecondDerivative)(aaveBalanceDelta, aaveConstants);
    var compBalanceDelta = x - W;
    var compSupplyRate = (0, convert_js_1.wadToRay)((0, services_js_2.calcCompSupplyRate)(compBalanceDelta, compConstants));
    var compSupplyRateDerivative = (0, convert_js_1.wadToRay)((0, services_js_2.calcCompSupplyRateDerivative)(compBalanceDelta, compConstants));
    var compSupplyRateSecondDerivative = (0, convert_js_1.wadToRay)((0, services_js_2.calcCompSupplyRateSecondDerivative)(compBalanceDelta, compConstants));
    var decimalFactor = Math.pow(10n, decimals);
    var netBalanceAfterAave = (0, convert_js_1.toRay)(A - x, decimalFactor);
    var netBalanceAfterComp = (0, convert_js_1.toRay)(C - W + x, decimalFactor);
    //P(x) = K(x-W) - U(-x)  + (C +  (x - W))k'(x -W)) - (A - x)U'(-x)
    var rateSum = compSupplyRate - aaveSupplyRate;
    var fx = rateSum +
        (0, mathUtils_js_1.rayMul)(netBalanceAfterComp, compSupplyRateDerivative) -
        (0, mathUtils_js_1.rayMul)(netBalanceAfterAave, aaveSupplyRateDerivative);
    // P'(x) =2K'(x-W) + 2U'(-x) + (C+ (x-W))K"(x-W) + (A-x)U"(-x)
    var rateDerivativeSum = compSupplyRateDerivative - aaveSupplyRateDerivative;
    var fxPrime = 2n * rateDerivativeSum +
        (0, mathUtils_js_1.rayMul)(netBalanceAfterAave, aaveSupplyRateSecondDerivative) +
        (0, mathUtils_js_1.rayMul)(netBalanceAfterComp, compSupplyRateSecondDerivative);
    return [fx, fxPrime];
}
