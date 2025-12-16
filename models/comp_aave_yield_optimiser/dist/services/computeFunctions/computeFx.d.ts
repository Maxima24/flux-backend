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
/***
 * Computes  Y =  ((A + x)U(x) + (C + W -x)K(W -x))/(A + C + W)
 *
 *
 * returns Y the value in ray factor
 *
 */
export declare function computeFxDepositRabalance(params: ComputeFunctionParams): bigint;
/***
 *  Computes Y = ((A -x)U(-x) + (C - (W -x) k(x - W)))/(A +C - W)
 *
 *
 *
 *  returns Y in ray factor
 */
export declare function computeFxWithdrawal(params: ComputeFunctionParams): bigint;
//# sourceMappingURL=computeFx.d.ts.map