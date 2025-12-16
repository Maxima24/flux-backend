/**
 * Represents detailed reserve data returned by the UI Pool Data Provider (AggregatedReserveData).
 * Contains on-chain configuration, token addresses and current numeric indicators used by the UI.
 */
export type AaveProtocolInitConstants = {
    /** The ERC-20 underlying token address for the reserve (e.g., USDC, WETH). */
    underlyingAsset: string;
    /** The human-readable name of the underlying token (e.g., "Aave USD Coin"). */
    name: string;
    /** The token symbol (e.g., "USDC"). */
    symbol: string;
    /** Number of decimals the token uses (commonly 6, 18, etc.). */
    decimals: bigint;
    /** Collateral loan-to-value ratio expressed in ray/wei units depending on the protocol (max borrow % when used as collateral). */
    baseLTVasCollateral: string;
    /** Liquidation threshold expressed in protocol units (the health factor threshold for liquidation). */
    reserveLiquidationThreshold: bigint;
    /** Liquidation bonus (aka liquidation spread) expressed in protocol units. */
    reserveLiquidationBonus: bigint;
    /** Portion of interest paid that flows to the protocol treasury (reserve factor). */
    reserveFactor: bigint;
    /** True when the asset may be used as collateral. */
    usageAsCollateralEnabled: boolean;
    /** True when borrowing of this asset is enabled. */
    borrowingEnabled: boolean;
    /** True when the reserve is active and available for use in the protocol. */
    isActive: boolean;
    /** True when the reserve is frozen and no actions are permitted. */
    isFrozen: boolean;
    /** Cumulative liquidity index for the reserve (Ray/decimal-normalized). */
    liquidityIndex: bigint;
    /** Cumulative variable borrow index for the reserve. */
    variableBorrowIndex: bigint;
    /** Current liquidity rate (supply APY) expressed in ray/uint128 units. */
    liquidityRate: bigint;
    /** Current variable borrow rate expressed in ray/uint128 units. */
    variableBorrowRate: bigint;
    /** Timestamp (unix seconds) of the last update for this reserve. */
    lastUpdateTimestamp: bigint;
    /** Address of the corresponding aToken (interest-bearing token) contract. */
    aTokenAddress: string;
    /** Address of the variable debt token contract for this reserve. */
    variableDebtTokenAddress: string;
    /** Address of the interest rate strategy contract used by this reserve. */
    interestRateStrategyAddress: string;
    /** Currently available liquidity in the reserve (amount of underlying available to borrow). */
    availableLiquidity: bigint;
    /** Total scaled variable debt for the reserve (used to compute total variable debt). */
    totalScaledVariableDebt: bigint;
    /** Price of the underlying token in the protocol's market reference currency (units depend on oracle). */
    priceInMarketReferenceCurrency: bigint;
    /** Address of the price oracle used for this reserve (if provided). */
    priceOracle: string;
    /** Slope 1 parameter for variable rate strategy (affects borrow rate curve). */
    variableRateSlope1: bigint;
    /** Slope 2 parameter for variable rate strategy (affects borrow rate curve). */
    variableRateSlope2: bigint;
    /** Base variable borrow rate configured in the strategy. */
    baseVariableBorrowRate: bigint;
    /** Optimal usage ratio for the reserve (when borrowing becomes more expensive). */
    optimalUsageRatio: bigint;
    /** True when the reserve is paused protocol-wide. */
    isPaused: boolean;
    /** True when siloed borrowing is enabled (isolated borrowing for this asset). */
    isSiloedBorrowing: boolean;
    /** Amount accrued to the protocol treasury (uint128). */
    accruedToTreasury: bigint;
    /** Unbacked amount (uint128) for the reserve if present. */
    unbacked: bigint;
    /** Total debt in isolation mode (uint128). */
    isolationModeTotalDebt: bigint;
    /** True when flash loans are enabled for this reserve. */
    flashLoanEnabled: boolean;
    /** Debt ceiling in protocol units for this reserve. */
    debtCeiling: bigint;
    /** Number of decimals that the debt ceiling uses. */
    debtCeilingDecimals: bigint;
    /** Borrow cap (maximum borrowable amount) for the reserve. */
    borrowCap: bigint;
    /** Supply cap (maximum supply allowed) for the reserve. */
    supplyCap: bigint;
    /** True when the asset is borrowable in isolation. */
    borrowableInIsolation: boolean;
    /** True when a virtual accounting mechanism is active for this reserve. */
    virtualAccActive: boolean;
    /** Virtual underlying balance used by certain mechanics (uint128). */
    virtualUnderlyingBalance: bigint;
};
/**
 * Base currency information returned by the UI Pool Data Provider.
 * Describes the protocol's market reference currency and network base token pricing.
 */
export type BaseCurrencyInfo = {
    /** Unit amount for the market reference currency (for scaling prices). */
    marketReferenceCurrencyUnit: bigint;
    /** Price of the market reference currency in USD (signed int for higher precision). */
    marketReferenceCurrencyPriceInUsd: bigint;
    /** Price of the network base token in USD (signed int). */
    networkBaseTokenPriceInUsd: bigint;
    /** Number of decimals used for the network base token price. */
    networkBaseTokenPriceDecimals: number;
};
/**
 * The full response shape for `getReservesData` from the UI pool data provider v3.
 * - `reserves` is an array of `AggregatedReserveData` entries.
 * - `baseCurrencyInfo` contains market-level currency information.
 */
export interface UiReservesDataResponse {
    reserves: AaveProtocolInitConstants[];
    baseCurrencyInfo: BaseCurrencyInfo;
}
export type AaveProtocolConstants = {
    virtualUnderlyingBalance: bigint;
    totalDebt: bigint;
    unbacked: bigint;
    decimals: bigint;
    variableRateSlope2: bigint;
    variableRateSlope1: bigint;
    baseVariableBorrowRate: bigint;
    optimalUsageRatio: bigint;
    reserveMultiple: bigint;
};
//# sourceMappingURL=types.d.ts.map