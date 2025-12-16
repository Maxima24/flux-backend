import type { AaveProtocolConstants } from "../services/aave/types.js";
import type { CompoundProtocolConstants } from "../services/compound/types.js";
import type { AssetMetaData, balancesParams } from "../types.js";
import type { Transaction } from "../types.js";
export declare const depositOptimalWorkflow: import("@langchain/langgraph").CompiledStateGraph<{
    agentAddress: string;
    balances: balancesParams;
    assetMetaData: AssetMetaData;
    aaveConstants: AaveProtocolConstants;
    compConstants: CompoundProtocolConstants;
    maxValuesInRanges: [bigint, bigint][];
    transactions: Transaction[];
}, {
    agentAddress?: string;
    balances?: balancesParams;
    assetMetaData?: AssetMetaData;
    aaveConstants?: AaveProtocolConstants;
    compConstants?: CompoundProtocolConstants;
    maxValuesInRanges?: [bigint, bigint][];
    transactions?: Transaction[];
}, "__start__" | "fetchAaveDetails" | "fetchCompDetails" | "fetchBalances" | "initiateRangeWorkers" | "getMaxValueWithinRange" | "getOptimalDelta", {
    agentAddress: {
        (): import("@langchain/langgraph").LastValue<string>;
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BinaryOperatorAggregate<string, string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    balances: {
        (): import("@langchain/langgraph").LastValue<balancesParams>;
        (annotation: import("@langchain/langgraph").SingleReducer<balancesParams, balancesParams>): import("@langchain/langgraph").BinaryOperatorAggregate<balancesParams, balancesParams>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    assetMetaData: {
        (): import("@langchain/langgraph").LastValue<AssetMetaData>;
        (annotation: import("@langchain/langgraph").SingleReducer<AssetMetaData, AssetMetaData>): import("@langchain/langgraph").BinaryOperatorAggregate<AssetMetaData, AssetMetaData>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    aaveConstants: {
        (): import("@langchain/langgraph").LastValue<AaveProtocolConstants>;
        (annotation: import("@langchain/langgraph").SingleReducer<AaveProtocolConstants, AaveProtocolConstants>): import("@langchain/langgraph").BinaryOperatorAggregate<AaveProtocolConstants, AaveProtocolConstants>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    compConstants: {
        (): import("@langchain/langgraph").LastValue<CompoundProtocolConstants>;
        (annotation: import("@langchain/langgraph").SingleReducer<CompoundProtocolConstants, CompoundProtocolConstants>): import("@langchain/langgraph").BinaryOperatorAggregate<CompoundProtocolConstants, CompoundProtocolConstants>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    maxValuesInRanges: import("@langchain/langgraph").BinaryOperatorAggregate<[bigint, bigint][], [bigint, bigint][]>;
    transactions: {
        (): import("@langchain/langgraph").LastValue<Transaction[]>;
        (annotation: import("@langchain/langgraph").SingleReducer<Transaction[], Transaction[]>): import("@langchain/langgraph").BinaryOperatorAggregate<Transaction[], Transaction[]>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
}, {
    agentAddress: {
        (): import("@langchain/langgraph").LastValue<string>;
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BinaryOperatorAggregate<string, string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    balances: {
        (): import("@langchain/langgraph").LastValue<balancesParams>;
        (annotation: import("@langchain/langgraph").SingleReducer<balancesParams, balancesParams>): import("@langchain/langgraph").BinaryOperatorAggregate<balancesParams, balancesParams>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    assetMetaData: {
        (): import("@langchain/langgraph").LastValue<AssetMetaData>;
        (annotation: import("@langchain/langgraph").SingleReducer<AssetMetaData, AssetMetaData>): import("@langchain/langgraph").BinaryOperatorAggregate<AssetMetaData, AssetMetaData>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    aaveConstants: {
        (): import("@langchain/langgraph").LastValue<AaveProtocolConstants>;
        (annotation: import("@langchain/langgraph").SingleReducer<AaveProtocolConstants, AaveProtocolConstants>): import("@langchain/langgraph").BinaryOperatorAggregate<AaveProtocolConstants, AaveProtocolConstants>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    compConstants: {
        (): import("@langchain/langgraph").LastValue<CompoundProtocolConstants>;
        (annotation: import("@langchain/langgraph").SingleReducer<CompoundProtocolConstants, CompoundProtocolConstants>): import("@langchain/langgraph").BinaryOperatorAggregate<CompoundProtocolConstants, CompoundProtocolConstants>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    maxValuesInRanges: import("@langchain/langgraph").BinaryOperatorAggregate<[bigint, bigint][], [bigint, bigint][]>;
    transactions: {
        (): import("@langchain/langgraph").LastValue<Transaction[]>;
        (annotation: import("@langchain/langgraph").SingleReducer<Transaction[], Transaction[]>): import("@langchain/langgraph").BinaryOperatorAggregate<Transaction[], Transaction[]>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
}, import("@langchain/langgraph").StateDefinition, {
    fetchAaveDetails: {
        aaveConstants: AaveProtocolConstants;
    };
    fetchCompDetails: {
        compConstants: CompoundProtocolConstants;
    };
    fetchBalances: {
        balances: balancesParams;
    };
    initiateRangeWorkers: import("@langchain/langgraph").UpdateType<{
        agentAddress: {
            (): import("@langchain/langgraph").LastValue<string>;
            (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BinaryOperatorAggregate<string, string>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        balances: {
            (): import("@langchain/langgraph").LastValue<balancesParams>;
            (annotation: import("@langchain/langgraph").SingleReducer<balancesParams, balancesParams>): import("@langchain/langgraph").BinaryOperatorAggregate<balancesParams, balancesParams>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        assetMetaData: {
            (): import("@langchain/langgraph").LastValue<AssetMetaData>;
            (annotation: import("@langchain/langgraph").SingleReducer<AssetMetaData, AssetMetaData>): import("@langchain/langgraph").BinaryOperatorAggregate<AssetMetaData, AssetMetaData>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        aaveConstants: {
            (): import("@langchain/langgraph").LastValue<AaveProtocolConstants>;
            (annotation: import("@langchain/langgraph").SingleReducer<AaveProtocolConstants, AaveProtocolConstants>): import("@langchain/langgraph").BinaryOperatorAggregate<AaveProtocolConstants, AaveProtocolConstants>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        compConstants: {
            (): import("@langchain/langgraph").LastValue<CompoundProtocolConstants>;
            (annotation: import("@langchain/langgraph").SingleReducer<CompoundProtocolConstants, CompoundProtocolConstants>): import("@langchain/langgraph").BinaryOperatorAggregate<CompoundProtocolConstants, CompoundProtocolConstants>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        maxValuesInRanges: import("@langchain/langgraph").BinaryOperatorAggregate<[bigint, bigint][], [bigint, bigint][]>;
        transactions: {
            (): import("@langchain/langgraph").LastValue<Transaction[]>;
            (annotation: import("@langchain/langgraph").SingleReducer<Transaction[], Transaction[]>): import("@langchain/langgraph").BinaryOperatorAggregate<Transaction[], Transaction[]>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
    }>;
    getMaxValueWithinRange: {
        maxValuesInRanges: [bigint, bigint][];
    };
    getOptimalDelta: {
        transactions: Transaction[];
    };
}, unknown, unknown>;
//# sourceMappingURL=depositRebalance.d.ts.map