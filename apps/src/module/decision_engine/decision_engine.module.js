"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisionEngineModule = void 0;
var decision_engine_service_1 = require("./decision_engine.service");
var decision_engine_controller_1 = require("./decision_engine.controller");
var yield_optimizer_strategy_1 = require("./strategies/yield-optimizer.strategy");
var conservative_strategy_1 = require("./strategies/conservative.strategy");
var gas_calculator_service_1 = require("./calculators/gas-calculator.service");
var profit_calculator_service_1 = require("./calculators/profit-calculator.service");
var DecisionEngineModule = function () {
    var _classDecorators = [module({
            imports: [],
            controllers: [decision_engine_controller_1.DecisionEngineController,
            ],
            providers: [decision_engine_service_1.DecisionEngineService, yield_optimizer_strategy_1.YieldOptimizerStrategy,
                conservative_strategy_1.ConservativeStrategy, gas_calculator_service_1.GasCalculatorService, profit_calculator_service_1.ProfitCalculatorService],
            exports: [decision_engine_service_1.DecisionEngineService]
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DecisionEngineModule = _classThis = /** @class */ (function () {
        function DecisionEngineModule_1() {
        }
        return DecisionEngineModule_1;
    }());
    __setFunctionName(_classThis, "DecisionEngineModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DecisionEngineModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DecisionEngineModule = _classThis;
}();
exports.DecisionEngineModule = DecisionEngineModule;
