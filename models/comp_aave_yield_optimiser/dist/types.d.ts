export type AssetMetaData = {
    compPoolAddress: string;
    aavePoolAddress: string;
    atokenAddress: string;
    assetAddress: string;
    symbol: string;
    decimals: bigint;
};
export type Transaction = ["WithdrawAave", bigint] | ["WithdrawCompound", bigint] | ["DepositAave", bigint] | ["DepositCompound", bigint] | ["TransferIdle", bigint];
export interface balancesParams {
    idleBalance: bigint;
    compBalance: bigint;
    aaveBalance: bigint;
}
//# sourceMappingURL=types.d.ts.map