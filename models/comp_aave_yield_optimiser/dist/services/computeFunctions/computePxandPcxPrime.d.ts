import type { AaveProtocolConstants } from "../aave/types.js";
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
export declare function computePxAndPxPrimeDepositOrRebalance(params: ComputeFunctionParams): [bigint, bigint];
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
export declare function computePxAndPxPrimeWithdrawal(params: ComputeFunctionParams): [bigint, bigint];
//# sourceMappingURL=computePxandPcxPrime.d.ts.map