import { rayDiv, rayMul, percentMul } from "../../utils/mathUtils.js";
import type {
  AaveProtocolConstants,
  AaveProtocolInitConstants,
} from "./types.js";

const SECONDS_PER_YEAR = 31536000n;
const RAY = 10n ** 27n;
const WAD = 10n ** 18n;
const PERCENTAGE_FACTOR = 10_000n;

export function calcAaveAvailableLiquidity(
  x: bigint,
  params: AaveProtocolConstants
) {
  const { virtualUnderlyingBalance } = params;
  return virtualUnderlyingBalance + x;
}

export function calcAaveBorrowUtilization(
  x: bigint,
  params: AaveProtocolConstants
): bigint {
  const { totalDebt } = params;
  return rayDiv(totalDebt, totalDebt + calcAaveAvailableLiquidity(x, params));
}

export function calcAaveSupplyUtilization(
  x: bigint,
  params: AaveProtocolConstants
): bigint {
  const { totalDebt, unbacked } = params;
  return rayDiv(
    totalDebt,
    totalDebt + unbacked + calcAaveAvailableLiquidity(x, params)
  );
}

export function calcAaveSupplyUtilizationDerivative(
  x: bigint,
  params: AaveProtocolConstants
): bigint {
  const { totalDebt, decimals } = params;
  let decimalsFactor = 10n ** decimals;
  const totalDebtRAY = rayDiv(totalDebt, decimalsFactor);
  let su = calcAaveSupplyUtilization(x, params);
  let mod = su ** 2n / totalDebtRAY;
  return -1n * mod;
}

export function calcAaveSupplyUtilizationSecondDerivative(
  x: bigint,
  params: AaveProtocolConstants
): bigint {
  const { totalDebt, decimals } = params;
  let decimalsFactor = 10n ** decimals;
  const totalDebtRAY = rayDiv(totalDebt, decimalsFactor);
  let su = calcAaveSupplyUtilization(x, params);
  return (2n * su ** 3n) / totalDebtRAY ** 2n;
}

export function calcAaveBorrowRate(
  x: bigint,
  params: AaveProtocolConstants
): bigint {
  const {
    variableRateSlope2,
    variableRateSlope1,
    baseVariableBorrowRate,
    optimalUsageRatio,
  } = params;
  let bu = calcAaveBorrowUtilization(x, params);
  if (bu == 0n) {
    return 0n;
  } else if (bu < optimalUsageRatio) {
    return (
      baseVariableBorrowRate + (variableRateSlope1 * bu) / optimalUsageRatio
    );
  } else {
    return (
      baseVariableBorrowRate +
      variableRateSlope1 +
      (variableRateSlope2 * (bu - optimalUsageRatio)) /
        (RAY - optimalUsageRatio)
    );
  }
}

export function calcAaveBorrowRateDerivative(
  x: bigint,
  params: AaveProtocolConstants
): bigint {
  const {
    variableRateSlope2,
    variableRateSlope1,
    optimalUsageRatio,
    totalDebt,
    decimals,
  } = params;
  let decimalsFactor = 10n ** decimals;
  const totalDebtRAY = rayDiv(totalDebt, decimalsFactor);
  let bu = calcAaveBorrowUtilization(x, params);
  if (bu < optimalUsageRatio) {
    return (
      ((variableRateSlope1 * bu ** 2n) / (optimalUsageRatio * totalDebtRAY)) *
      -1n
    );
  } else {
    return (
      ((variableRateSlope2 * bu ** 2n) /
        ((RAY - optimalUsageRatio) * totalDebtRAY)) *
      -1n
    );
  }
}

export function calcAaveBorrowRateSecondDerivative(
  x: bigint,
  params: AaveProtocolConstants
): bigint {
  const {
    variableRateSlope2,
    variableRateSlope1,
    optimalUsageRatio,
    totalDebt,
    decimals,
  } = params;
  let decimalsFactor = 10n ** decimals;
  const totalDebtRAY = rayDiv(totalDebt, decimalsFactor);
  let bu = calcAaveBorrowUtilization(x, params);
  if (bu < optimalUsageRatio) {
    return (
      (variableRateSlope1 * 2n * bu ** 3n) /
      (optimalUsageRatio * totalDebtRAY ** 2n)
    );
  } else {
    return (
      (variableRateSlope2 * 2n * bu ** 3n) /
      ((RAY - optimalUsageRatio) * totalDebtRAY ** 2n)
    );
  }
}

export function calcAaveSupplyRate(
  x: bigint,
  params: AaveProtocolConstants
): bigint {
  const { reserveMultiple } = params;
  const su = calcAaveSupplyUtilization(x, params);
  const br = calcAaveBorrowRate(x, params);
  return percentMul(rayMul(su, br), reserveMultiple);
}

export function calcAaveSupplyRateDerivative(
  x: bigint,
  params: AaveProtocolConstants
): bigint {
  const { reserveMultiple } = params;
  let br = calcAaveBorrowRate(x, params);
  let brd = calcAaveBorrowRateDerivative(x, params);
  let su = calcAaveSupplyUtilization(x, params);
  let sud = calcAaveSupplyUtilizationDerivative(x, params);
  return percentMul(rayMul(br, sud) + rayMul(su, brd), reserveMultiple);
}

export function calcAaveSupplyRateSecondDerivative(
  x: bigint,
  params: AaveProtocolConstants
): bigint {
  const { reserveMultiple } = params;
  let br = calcAaveBorrowRate(x, params);
  let brd = calcAaveBorrowRateDerivative(x, params);
  let brsd = calcAaveBorrowRateSecondDerivative(x, params);
  let su = calcAaveSupplyUtilization(x, params);
  let sud = calcAaveSupplyUtilizationDerivative(x, params);
  let susd = calcAaveSupplyUtilizationSecondDerivative(x, params);
  let curveRate = rayMul(brsd, su);
  let interaction = rayMul(2n * brd, sud);
  let curveUtil = rayMul(susd, br);
  return percentMul(curveRate + interaction + curveUtil, reserveMultiple);
}

export function calcAaveThreshold(params: AaveProtocolConstants): bigint {
  const { totalDebt, optimalUsageRatio, virtualUnderlyingBalance } = params;
  let num =
    totalDebt * (RAY - optimalUsageRatio) -
    optimalUsageRatio * virtualUnderlyingBalance;
  return num / optimalUsageRatio;
}

export function initConstants(
  params: AaveProtocolInitConstants
): AaveProtocolConstants {
  let {
    totalScaledVariableDebt,
    reserveFactor,
    virtualUnderlyingBalance,
    unbacked,
    decimals,
    variableRateSlope2,
    variableRateSlope1,
    baseVariableBorrowRate,
    optimalUsageRatio,
  } = params;
  let [_, updatedBorrowIndex] = updatedCurrentIndexesAave(params);
  let totalDebt = rayMul(updatedBorrowIndex, totalScaledVariableDebt);
  let reserveMultiple = PERCENTAGE_FACTOR - reserveFactor;

  return {
    variableRateSlope1,
    variableRateSlope2,
    baseVariableBorrowRate,
    unbacked,
    decimals,
    optimalUsageRatio,
    virtualUnderlyingBalance,
    totalDebt,
    reserveMultiple,
  };
}

type UpdateCurrentIndexesParams = {
  liquidityIndex: bigint;
  liquidityRate: bigint;
  variableBorrowIndex: bigint;
  variableBorrowRate: bigint;
  lastUpdateTimestamp: bigint;
  totalScaledVariableDebt: bigint;
};

function updatedCurrentIndexesAave({
  lastUpdateTimestamp,
  variableBorrowIndex,
  variableBorrowRate,
  totalScaledVariableDebt,
  liquidityIndex,
  liquidityRate,
}: UpdateCurrentIndexesParams): [bigint, bigint] {
  const currentTimestamp: bigint = BigInt(Math.floor(Date.now() / 1000));

  const timeElapsed: bigint = currentTimestamp - BigInt(lastUpdateTimestamp);

  let updatedSupplyIndex = liquidityIndex;

  if (liquidityRate != 0n) {
    let linearInterestFactor =
      RAY + (liquidityRate * timeElapsed) / SECONDS_PER_YEAR;

    updatedSupplyIndex = rayMul(linearInterestFactor, liquidityIndex);
  }

  let updatedBorrowIndex = variableBorrowIndex;

  if (totalScaledVariableDebt != 0n) {
    let compoundedInterestFactor;
    if (timeElapsed == 0n) {
      compoundedInterestFactor = RAY;
    } else {
      let x = (variableBorrowRate * timeElapsed) / SECONDS_PER_YEAR;

      compoundedInterestFactor =
        RAY + x + rayMul(x, x / 2n + rayMul(x, x / 6n));
    }

    updatedBorrowIndex = rayMul(compoundedInterestFactor, variableBorrowIndex);
  }

  return [updatedSupplyIndex, updatedBorrowIndex];
}
