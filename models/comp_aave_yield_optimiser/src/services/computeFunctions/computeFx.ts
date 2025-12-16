import { toRay, wadToRay } from "../../utils/convert.js";
import { factorDiv, factorMul, wadMul } from "../../utils/mathUtils.js";
import { calcAaveSupplyRate } from "../aave/services.js";
import { rayDiv, rayMul } from "../../utils/mathUtils.js";
import type { AaveProtocolConstants } from "../aave/types.js";
import { calcCompSupplyRate } from "../compound/services.js";
import type { CompoundProtocolConstants } from "../compound/types.js";

export interface ComputeFunctionParams {
  A: bigint;
  C: bigint;
  W: bigint;
  x: bigint;
  decimals: bigint;
  aaveConstants: AaveProtocolConstants;
  compConstants: CompoundProtocolConstants;
}

/***
 * Computes  Y =  ((A + x)U(x) + (C + W -x)K(W -x))/(A + C + W)
 *
 *
 * returns Y the value in ray factor
 *
 */
export function computeFxDepositRabalance(
  params: ComputeFunctionParams
): bigint {
  const { A, C, W, x, aaveConstants, compConstants, decimals } = params;

  const aaveBalanceDelta = x;

  const aaveSupplyRate = calcAaveSupplyRate(aaveBalanceDelta, aaveConstants);

  //console.log("the aave supply rate is " + aaveSupplyRate);

  const compBalanceDelta = W - x;

  const compSupplyRate = wadToRay(
    calcCompSupplyRate(compBalanceDelta, compConstants)
  );

  // console.log("The comp supply rate is " + compSupplyRate);

  const decimalFactor = 10n ** decimals;

  let aaveNetBalanceAfter = toRay(A + aaveBalanceDelta, decimalFactor);

  let compNetBalanceAfter = toRay(C + compBalanceDelta, decimalFactor);

  let factor1 = rayMul(aaveNetBalanceAfter, aaveSupplyRate);

  let factor2 = rayMul(compNetBalanceAfter, compSupplyRate);

  let sum = toRay(A + C + W, decimalFactor);

  const fx = rayDiv(factor1 + factor2, sum);

  return fx;
}

/***
 *  Computes Y = ((A -x)U(-x) + (C - (W -x) k(x - W)))/(A +C - W)
 *
 *
 *
 *  returns Y in ray factor
 */
export function computeFxWithdrawal(params: ComputeFunctionParams): bigint {
  const { A, C, W, x, aaveConstants, compConstants, decimals } = params;

  const aaveBalanceDelta = -x;

  const aaveSupplyRate = calcAaveSupplyRate(aaveBalanceDelta, aaveConstants);

  //console.log("the aave supply rate is " + aaveSupplyRate);

  const compBalanceDelta = x - W;

  const compSupplyRate = wadToRay(
    calcCompSupplyRate(compBalanceDelta, compConstants)
  );

  // console.log("The comp supply rate is " + compSupplyRate);

  const decimalFactor = 10n ** decimals;

  let aaveNetBalanceAfter = toRay(A + aaveBalanceDelta, decimalFactor);

  let compNetBalanceAfter = toRay(C + compBalanceDelta, decimalFactor);

  let factor1 = rayMul(aaveNetBalanceAfter, aaveSupplyRate);

  let factor2 = rayMul(compNetBalanceAfter, compSupplyRate);

  let sum = toRay(A + C - W, decimalFactor);

  const fx = rayDiv(factor1 + factor2, sum);
  // (A + x)( U(x)) + (C + W -x)K(x)/(A + C + W)
  return fx;
}
