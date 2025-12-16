import { toRay, toWad, wadToRay } from "../../utils/convert.js";
import {
  calcAaveSupplyRate,
  calcAaveSupplyRateDerivative,
  calcAaveSupplyRateSecondDerivative,
} from "../aave/services.js";
import { rayMul } from "../../utils/mathUtils.js";
import type { AaveProtocolConstants } from "../aave/types.js";
import {
  calcCompSupplyRate,
  calcCompSupplyRateDerivative,
  calcCompSupplyRateSecondDerivative,
} from "../compound/services.js";
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
export function computePxAndPxPrimeDepositOrRebalance(
  params: ComputeFunctionParams
): [bigint, bigint] {
  const { A, C, W, x, aaveConstants, compConstants, decimals } = params;

  const aaveBalanceDelta = x;

  const aaveSupplyRate = calcAaveSupplyRate(aaveBalanceDelta, aaveConstants);

  const aaveSupplyRateDerivative = calcAaveSupplyRateDerivative(
    aaveBalanceDelta,
    aaveConstants
  );

  const aaveSupplyRateSecondDerivative = calcAaveSupplyRateSecondDerivative(
    aaveBalanceDelta,
    aaveConstants
  );

  const compBalanceDelta = W - x;

  const compSupplyRate = wadToRay(
    calcCompSupplyRate(compBalanceDelta, compConstants)
  );

  const compSupplyRateDerivative = wadToRay(
    calcCompSupplyRateDerivative(compBalanceDelta, compConstants)
  );

  const compSupplyRateSecondDerivative = wadToRay(
    calcCompSupplyRateSecondDerivative(compBalanceDelta, compConstants)
  );
  const decimalFactor = 10n ** decimals;

  const netBalanceAfterAave = toRay(A + aaveBalanceDelta, decimalFactor);

  const netBalanceAfterComp = toRay(C + compBalanceDelta, decimalFactor);

  //P(x) = U(x) - K(W-x) +(A + x)U'(x) - (C + W -x)K'(W-x)

  const rateNetSums = aaveSupplyRate - compSupplyRate;

  const px =
    rateNetSums +
    rayMul(netBalanceAfterAave, aaveSupplyRateDerivative) -
    rayMul(netBalanceAfterComp, compSupplyRateDerivative);

  const rateDerivativeSum = aaveSupplyRateDerivative + compSupplyRate;

  // return fx;

  //P'(x) =2U'(x) + 2K'(W-x) + (A + x)U"(x)  + (C + W -x)K"(W-x)
  const pxPrime =
    2n * rateDerivativeSum +
    rayMul(netBalanceAfterAave, aaveSupplyRateSecondDerivative) +
    rayMul(netBalanceAfterComp, compSupplyRateSecondDerivative);

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
export function computePxAndPxPrimeWithdrawal(
  params: ComputeFunctionParams
): [bigint, bigint] {
  const { A, C, W, x, aaveConstants, compConstants, decimals } = params;

  const aaveBalanceDelta = -x;

  const aaveSupplyRate = calcAaveSupplyRate(aaveBalanceDelta, aaveConstants);

  const aaveSupplyRateDerivative = calcAaveSupplyRateDerivative(
    aaveBalanceDelta,
    aaveConstants
  );

  const aaveSupplyRateSecondDerivative = calcAaveSupplyRateSecondDerivative(
    aaveBalanceDelta,
    aaveConstants
  );

  const compBalanceDelta = x - W;

  const compSupplyRate = wadToRay(
    calcCompSupplyRate(compBalanceDelta, compConstants)
  );

  const compSupplyRateDerivative = wadToRay(
    calcCompSupplyRateDerivative(compBalanceDelta, compConstants)
  );

  const compSupplyRateSecondDerivative = wadToRay(
    calcCompSupplyRateSecondDerivative(compBalanceDelta, compConstants)
  );

  const decimalFactor = 10n ** decimals;

  const netBalanceAfterAave = toRay(A - x, decimalFactor);

  const netBalanceAfterComp = toRay(C - W + x, decimalFactor);

  //P(x) = K(x-W) - U(-x)  + (C +  (x - W))k'(x -W)) - (A - x)U'(-x)
  const rateSum = compSupplyRate - aaveSupplyRate;

  const fx =
    rateSum +
    rayMul(netBalanceAfterComp, compSupplyRateDerivative) -
    rayMul(netBalanceAfterAave, aaveSupplyRateDerivative);

  // P'(x) =2K'(x-W) + 2U'(-x) + (C+ (x-W))K"(x-W) + (A-x)U"(-x)
  const rateDerivativeSum = compSupplyRateDerivative - aaveSupplyRateDerivative;

  const fxPrime =
    2n * rateDerivativeSum +
    rayMul(netBalanceAfterAave, aaveSupplyRateSecondDerivative) +
    rayMul(netBalanceAfterComp, compSupplyRateSecondDerivative);

  return [fx, fxPrime];
}
