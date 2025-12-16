import type { AaveProtocolConstants, AaveProtocolInitConstants } from "./types.js";
export declare function calcAaveAvailableLiquidity(x: bigint, params: AaveProtocolConstants): bigint;
export declare function calcAaveBorrowUtilization(x: bigint, params: AaveProtocolConstants): bigint;
export declare function calcAaveSupplyUtilization(x: bigint, params: AaveProtocolConstants): bigint;
export declare function calcAaveSupplyUtilizationDerivative(x: bigint, params: AaveProtocolConstants): bigint;
export declare function calcAaveSupplyUtilizationSecondDerivative(x: bigint, params: AaveProtocolConstants): bigint;
export declare function calcAaveBorrowRate(x: bigint, params: AaveProtocolConstants): bigint;
export declare function calcAaveBorrowRateDerivative(x: bigint, params: AaveProtocolConstants): bigint;
export declare function calcAaveBorrowRateSecondDerivative(x: bigint, params: AaveProtocolConstants): bigint;
export declare function calcAaveSupplyRate(x: bigint, params: AaveProtocolConstants): bigint;
export declare function calcAaveSupplyRateDerivative(x: bigint, params: AaveProtocolConstants): bigint;
export declare function calcAaveSupplyRateSecondDerivative(x: bigint, params: AaveProtocolConstants): bigint;
export declare function calcAaveThreshold(params: AaveProtocolConstants): bigint;
export declare function initConstants(params: AaveProtocolInitConstants): AaveProtocolConstants;
//# sourceMappingURL=services.d.ts.map