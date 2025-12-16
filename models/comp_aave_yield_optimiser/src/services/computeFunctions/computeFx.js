"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeFxDepositRabalance = computeFxDepositRabalance;
exports.computeFxWithdrawal = computeFxWithdrawal;
var convert_js_1 = require("../../utils/convert.js");
var services_js_1 = require("../aave/services.js");
var mathUtils_js_1 = require("../../utils/mathUtils.js");
var services_js_2 = require("../compound/services.js");
/***
 * Computes  Y =  ((A + x)U(x) + (C + W -x)K(W -x))/(A + C + W)
 *
 *
 * returns Y the value in ray factor
 *
 */
function computeFxDepositRabalance(params) {
    var A = params.A, C = params.C, W = params.W, x = params.x, aaveConstants = params.aaveConstants, compConstants = params.compConstants, decimals = params.decimals;
    var aaveBalanceDelta = x;
    var aaveSupplyRate = (0, services_js_1.calcAaveSupplyRate)(aaveBalanceDelta, aaveConstants);
    //console.log("the aave supply rate is " + aaveSupplyRate);
    var compBalanceDelta = W - x;
    var compSupplyRate = (0, convert_js_1.wadToRay)((0, services_js_2.calcCompSupplyRate)(compBalanceDelta, compConstants));
    // console.log("The comp supply rate is " + compSupplyRate);
    var decimalFactor = Math.pow(10n, decimals);
    var aaveNetBalanceAfter = (0, convert_js_1.toRay)(A + aaveBalanceDelta, decimalFactor);
    var compNetBalanceAfter = (0, convert_js_1.toRay)(C + compBalanceDelta, decimalFactor);
    var factor1 = (0, mathUtils_js_1.rayMul)(aaveNetBalanceAfter, aaveSupplyRate);
    var factor2 = (0, mathUtils_js_1.rayMul)(compNetBalanceAfter, compSupplyRate);
    var sum = (0, convert_js_1.toRay)(A + C + W, decimalFactor);
    var fx = (0, mathUtils_js_1.rayDiv)(factor1 + factor2, sum);
    return fx;
}
/***
 *  Computes Y = ((A -x)U(-x) + (C - (W -x) k(x - W)))/(A +C - W)
 *
 *
 *
 *  returns Y in ray factor
 */
function computeFxWithdrawal(params) {
    var A = params.A, C = params.C, W = params.W, x = params.x, aaveConstants = params.aaveConstants, compConstants = params.compConstants, decimals = params.decimals;
    var aaveBalanceDelta = -x;
    var aaveSupplyRate = (0, services_js_1.calcAaveSupplyRate)(aaveBalanceDelta, aaveConstants);
    //console.log("the aave supply rate is " + aaveSupplyRate);
    var compBalanceDelta = x - W;
    var compSupplyRate = (0, convert_js_1.wadToRay)((0, services_js_2.calcCompSupplyRate)(compBalanceDelta, compConstants));
    // console.log("The comp supply rate is " + compSupplyRate);
    var decimalFactor = Math.pow(10n, decimals);
    var aaveNetBalanceAfter = (0, convert_js_1.toRay)(A + aaveBalanceDelta, decimalFactor);
    var compNetBalanceAfter = (0, convert_js_1.toRay)(C + compBalanceDelta, decimalFactor);
    var factor1 = (0, mathUtils_js_1.rayMul)(aaveNetBalanceAfter, aaveSupplyRate);
    var factor2 = (0, mathUtils_js_1.rayMul)(compNetBalanceAfter, compSupplyRate);
    var sum = (0, convert_js_1.toRay)(A + C - W, decimalFactor);
    var fx = (0, mathUtils_js_1.rayDiv)(factor1 + factor2, sum);
    // (A + x)( U(x)) + (C + W -x)K(x)/(A + C + W)
    return fx;
}
