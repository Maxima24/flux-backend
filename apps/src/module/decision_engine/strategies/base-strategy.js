"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.BaseStrategy = void 0;
var common_1 = require("@nestjs/common");
var BaseStrategy = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var BaseStrategy = _classThis = /** @class */ (function () {
        function BaseStrategy_1(loggerContext) {
            this.logger = new common_1.Logger(loggerContext);
        }
        /**
         * Check if enough time has passed since last rebalance
         */
        BaseStrategy_1.prototype.hasEnoughTimePassed = function (position) {
            if (!position.lastRebalance)
                return true;
            var timeSinceLastRebalance = (Date.now() - position.lastRebalance.getTime()) / 1000;
            var canRebalance = timeSinceLastRebalance >= this.config.minRebalanceInterval;
            if (!canRebalance) {
                var hoursRemaining = (this.config.minRebalanceInterval - timeSinceLastRebalance) / 3600;
                this.logger.debug("Cannot rebalance yet. ".concat(hoursRemaining.toFixed(1), " hours remaining"));
            }
            return canRebalance;
        };
        /**
         * Filter protocols based on risk tolerance
         */
        BaseStrategy_1.prototype.filterByRisk = function (yields) {
            switch (this.config.riskTolerance) {
                case 'conservative':
                    // Only established protocols with high TVL
                    return yields.filter(function (y) { return y.tvl > 10000000; }); // > $10M TVL
                case 'moderate':
                    return yields.filter(function (y) { return y.tvl > 1000000; }); // > $1M TVL
                case 'aggressive':
                    return yields; // Accept all
                default:
                    return yields;
            }
        };
        /**
         * Find best yield from available options
         */
        BaseStrategy_1.prototype.findBestYield = function (yields, asset) {
            var filtered = yields.filter(function (y) {
                return y.asset === asset && y.apy > 0;
            });
            if (filtered.length === 0)
                return null;
            // Sort by APY descending
            var sorted = filtered.sort(function (a, b) { return b.apy - a.apy; });
            return sorted[0];
        };
        /**
         * Create a "hold" decision (no rebalancing)
         */
        BaseStrategy_1.prototype.createHoldDecision = function (reason) {
            return {
                shouldRebalance: false,
                targetProtocol: null,
                expectedGainAPY: 0,
                gasCostUSD: 0,
                netBenefitAPY: 0,
                reasoning: reason,
                metadata: {
                    strategy: this.constructor.name,
                    timestamp: new Date().toISOString(),
                },
            };
        };
        /**
         * Create a "rebalance" decision
         */
        BaseStrategy_1.prototype.createRebalanceDecision = function (targetProtocol, targetProtocolAddress, expectedGainAPY, gasCostUSD, netBenefitAPY, reasoning, metadata) {
            if (metadata === void 0) { metadata = {}; }
            return {
                shouldRebalance: true,
                targetProtocol: targetProtocol,
                targetProtocolAddress: targetProtocolAddress,
                expectedGainAPY: expectedGainAPY,
                gasCostUSD: gasCostUSD,
                netBenefitAPY: netBenefitAPY,
                reasoning: reasoning,
                metadata: __assign({ strategy: this.constructor.name, timestamp: new Date().toISOString() }, metadata),
            };
        };
        return BaseStrategy_1;
    }());
    __setFunctionName(_classThis, "BaseStrategy");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BaseStrategy = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BaseStrategy = _classThis;
}();
exports.BaseStrategy = BaseStrategy;
