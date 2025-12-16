export type PxInvariants = {
    x0: bigint;
    xFactor: bigint;
    pxFactor: bigint;
    edge: [bigint, bigint];
    computePxAndPxPrimeofX: ComputePxAndPxPrime;
    computeFxofX: ComputeFx;
};
type ComputePxAndPxPrime = (x: bigint) => [bigint, bigint];
type ComputeFx = (x: bigint) => bigint;
export declare const newtonRalphWorkflowState: import("@langchain/langgraph").AnnotationRoot<{
    invariants: {
        (): import("@langchain/langgraph").LastValue<PxInvariants>;
        (annotation: import("@langchain/langgraph").SingleReducer<PxInvariants, PxInvariants>): import("@langchain/langgraph").BinaryOperatorAggregate<PxInvariants, PxInvariants>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    iterationCount: {
        (): import("@langchain/langgraph").LastValue<number>;
        (annotation: import("@langchain/langgraph").SingleReducer<number, number>): import("@langchain/langgraph").BinaryOperatorAggregate<number, number>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    Xterms: {
        (): import("@langchain/langgraph").LastValue<[bigint, bigint, bigint][]>;
        (annotation: import("@langchain/langgraph").SingleReducer<[bigint, bigint, bigint][], [bigint, bigint, bigint][]>): import("@langchain/langgraph").BinaryOperatorAggregate<[bigint, bigint, bigint][], [bigint, bigint, bigint][]>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    maxValuesInRanges: import("@langchain/langgraph").BinaryOperatorAggregate<[bigint, bigint][], [bigint, bigint][]>;
}>;
export type NewtonRalphFlowState = typeof newtonRalphWorkflowState.State;
export declare const newtonRapshonWorkflow: import("@langchain/langgraph").CompiledStateGraph<{
    invariants: PxInvariants;
    iterationCount: number;
    Xterms: [bigint, bigint, bigint][];
    maxValuesInRanges: [bigint, bigint][];
}, {
    invariants?: PxInvariants;
    iterationCount?: number;
    Xterms?: [bigint, bigint, bigint][];
    maxValuesInRanges?: [bigint, bigint][];
}, "nextApproximate" | "getMaxFx" | "llmCheck" | "__start__" | "initX0", {
    invariants: {
        (): import("@langchain/langgraph").LastValue<PxInvariants>;
        (annotation: import("@langchain/langgraph").SingleReducer<PxInvariants, PxInvariants>): import("@langchain/langgraph").BinaryOperatorAggregate<PxInvariants, PxInvariants>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    iterationCount: {
        (): import("@langchain/langgraph").LastValue<number>;
        (annotation: import("@langchain/langgraph").SingleReducer<number, number>): import("@langchain/langgraph").BinaryOperatorAggregate<number, number>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    Xterms: {
        (): import("@langchain/langgraph").LastValue<[bigint, bigint, bigint][]>;
        (annotation: import("@langchain/langgraph").SingleReducer<[bigint, bigint, bigint][], [bigint, bigint, bigint][]>): import("@langchain/langgraph").BinaryOperatorAggregate<[bigint, bigint, bigint][], [bigint, bigint, bigint][]>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    maxValuesInRanges: import("@langchain/langgraph").BinaryOperatorAggregate<[bigint, bigint][], [bigint, bigint][]>;
}, {
    invariants: {
        (): import("@langchain/langgraph").LastValue<PxInvariants>;
        (annotation: import("@langchain/langgraph").SingleReducer<PxInvariants, PxInvariants>): import("@langchain/langgraph").BinaryOperatorAggregate<PxInvariants, PxInvariants>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    iterationCount: {
        (): import("@langchain/langgraph").LastValue<number>;
        (annotation: import("@langchain/langgraph").SingleReducer<number, number>): import("@langchain/langgraph").BinaryOperatorAggregate<number, number>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    Xterms: {
        (): import("@langchain/langgraph").LastValue<[bigint, bigint, bigint][]>;
        (annotation: import("@langchain/langgraph").SingleReducer<[bigint, bigint, bigint][], [bigint, bigint, bigint][]>): import("@langchain/langgraph").BinaryOperatorAggregate<[bigint, bigint, bigint][], [bigint, bigint, bigint][]>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    maxValuesInRanges: import("@langchain/langgraph").BinaryOperatorAggregate<[bigint, bigint][], [bigint, bigint][]>;
}, import("@langchain/langgraph").StateDefinition, {
    initX0: import("@langchain/langgraph").UpdateType<{
        invariants: {
            (): import("@langchain/langgraph").LastValue<PxInvariants>;
            (annotation: import("@langchain/langgraph").SingleReducer<PxInvariants, PxInvariants>): import("@langchain/langgraph").BinaryOperatorAggregate<PxInvariants, PxInvariants>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        iterationCount: {
            (): import("@langchain/langgraph").LastValue<number>;
            (annotation: import("@langchain/langgraph").SingleReducer<number, number>): import("@langchain/langgraph").BinaryOperatorAggregate<number, number>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        Xterms: {
            (): import("@langchain/langgraph").LastValue<[bigint, bigint, bigint][]>;
            (annotation: import("@langchain/langgraph").SingleReducer<[bigint, bigint, bigint][], [bigint, bigint, bigint][]>): import("@langchain/langgraph").BinaryOperatorAggregate<[bigint, bigint, bigint][], [bigint, bigint, bigint][]>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        maxValuesInRanges: import("@langchain/langgraph").BinaryOperatorAggregate<[bigint, bigint][], [bigint, bigint][]>;
    }>;
    llmCheck: import("@langchain/langgraph").UpdateType<{
        invariants: {
            (): import("@langchain/langgraph").LastValue<PxInvariants>;
            (annotation: import("@langchain/langgraph").SingleReducer<PxInvariants, PxInvariants>): import("@langchain/langgraph").BinaryOperatorAggregate<PxInvariants, PxInvariants>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        iterationCount: {
            (): import("@langchain/langgraph").LastValue<number>;
            (annotation: import("@langchain/langgraph").SingleReducer<number, number>): import("@langchain/langgraph").BinaryOperatorAggregate<number, number>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        Xterms: {
            (): import("@langchain/langgraph").LastValue<[bigint, bigint, bigint][]>;
            (annotation: import("@langchain/langgraph").SingleReducer<[bigint, bigint, bigint][], [bigint, bigint, bigint][]>): import("@langchain/langgraph").BinaryOperatorAggregate<[bigint, bigint, bigint][], [bigint, bigint, bigint][]>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        maxValuesInRanges: import("@langchain/langgraph").BinaryOperatorAggregate<[bigint, bigint][], [bigint, bigint][]>;
    }>;
    nextApproximate: import("@langchain/langgraph").UpdateType<{
        invariants: {
            (): import("@langchain/langgraph").LastValue<PxInvariants>;
            (annotation: import("@langchain/langgraph").SingleReducer<PxInvariants, PxInvariants>): import("@langchain/langgraph").BinaryOperatorAggregate<PxInvariants, PxInvariants>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        iterationCount: {
            (): import("@langchain/langgraph").LastValue<number>;
            (annotation: import("@langchain/langgraph").SingleReducer<number, number>): import("@langchain/langgraph").BinaryOperatorAggregate<number, number>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        Xterms: {
            (): import("@langchain/langgraph").LastValue<[bigint, bigint, bigint][]>;
            (annotation: import("@langchain/langgraph").SingleReducer<[bigint, bigint, bigint][], [bigint, bigint, bigint][]>): import("@langchain/langgraph").BinaryOperatorAggregate<[bigint, bigint, bigint][], [bigint, bigint, bigint][]>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        maxValuesInRanges: import("@langchain/langgraph").BinaryOperatorAggregate<[bigint, bigint][], [bigint, bigint][]>;
    }>;
    getMaxFx: {
        maxValuesInRanges: [bigint, bigint][];
    };
}, unknown, unknown>;
export {};
//# sourceMappingURL=newton.d.ts.map