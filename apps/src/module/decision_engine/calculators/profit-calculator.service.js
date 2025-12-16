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
exports.ProfitCalculatorService = void 0;
var common_1 = require("@nestjs/common");
var ProfitCalculatorService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProfitCalculatorService = _classThis = /** @class */ (function () {
        function ProfitCalculatorService_1() {
            this.logger = new common_1.Logger(ProfitCalculatorService.name);
        }
        /**
         * Calculate complete profit analysis for a rebalancing decision
         */
        ProfitCalculatorService_1.prototype.calculateProfitability = function (position, targetAPY, gasCost, thresholds) {
            var apyImprovement = targetAPY - position.currentAPY;
            var amount = position.amount;
            // Calculate gains
            var annualGainUSD = (apyImprovement / 100) * amount;
            var monthlyGainUSD = annualGainUSD / 12;
            var dailyGainUSD = annualGainUSD / 365;
            // Net calculations
            var gasCostUSD = gasCost.gasCostUSD;
            var netAnnualGainUSD = annualGainUSD - gasCostUSD;
            var netBenefitAPY = (netAnnualGainUSD / amount) * 100;
            // Break-even analysis
            var breakEvenDays = dailyGainUSD > 0
                ? gasCostUSD / dailyGainUSD
                : Infinity;
            // ROI calculation
            var roi = gasCostUSD > 0 ? netAnnualGainUSD / gasCostUSD : 0;
            // Decision logic
            var isWorthwhile = true;
            var reasoning = '';
            if (apyImprovement < thresholds.minAPYImprovement) {
                isWorthwhile = false;
                reasoning = "APY improvement ".concat(apyImprovement.toFixed(2), "% below threshold ").concat(thresholds.minAPYImprovement, "%");
            }
            else if (netAnnualGainUSD < thresholds.minProfitUSD) {
                isWorthwhile = false;
                reasoning = "Net annual gain $".concat(netAnnualGainUSD.toFixed(2), " below minimum $").concat(thresholds.minProfitUSD);
            }
            else if (gasCostUSD > annualGainUSD * thresholds.maxGasCostRatio) {
                isWorthwhile = false;
                var gasCostPercentage = (gasCostUSD / annualGainUSD * 100).toFixed(1);
                reasoning = "Gas cost ".concat(gasCostPercentage, "% of annual gain exceeds ").concat(thresholds.maxGasCostRatio * 100, "% threshold");
            }
            else if (breakEvenDays > 30) {
                isWorthwhile = false;
                reasoning = "Break-even period ".concat(Math.round(breakEvenDays), " days too long");
            }
            else {
                reasoning = "Profitable move: ".concat(apyImprovement.toFixed(2), "% APY gain, break-even in ").concat(Math.round(breakEvenDays), " days");
            }
            this.logger.debug("Profit analysis: ".concat(reasoning));
            return {
                apyImprovement: apyImprovement,
                annualGainUSD: annualGainUSD,
                dailyGainUSD: dailyGainUSD,
                monthlyGainUSD: monthlyGainUSD,
                gasCostUSD: gasCostUSD,
                netAnnualGainUSD: netAnnualGainUSD,
                netBenefitAPY: netBenefitAPY,
                breakEvenDays: breakEvenDays,
                roi: roi,
                isWorthwhile: isWorthwhile,
                reasoning: reasoning,
            };
        };
        /**
         * Calculate minimum amount needed to make rebalancing worthwhile
         */
        ProfitCalculatorService_1.prototype.calculateMinimumViableAmount = function (apyImprovement, gasCostUSD, minBreakEvenDays) {
            if (minBreakEvenDays === void 0) { minBreakEvenDays = 7; }
            // Daily gain needed = gas cost / break-even days
            var requiredDailyGain = gasCostUSD / minBreakEvenDays;
            // Annual gain needed = daily gain * 365
            var requiredAnnualGain = requiredDailyGain * 365;
            // Amount needed = annual gain / APY improvement
            var minAmount = (requiredAnnualGain / apyImprovement) * 100;
            return minAmount;
        };
        /**
         * Calculate expected value of waiting vs moving now
         */
        ProfitCalculatorService_1.prototype.calculateExpectedValue = function (currentAPY, targetAPY, amount, gasCostUSD, daysToHold) {
            // Value if we move now
            var moveNowGain = ((targetAPY / 100) * amount * daysToHold) / 365;
            var moveNowValue = moveNowGain - gasCostUSD;
            // Value if we wait
            var waitAndHoldGain = ((currentAPY / 100) * amount * daysToHold) / 365;
            var waitAndHoldValue = waitAndHoldGain;
            return {
                moveNow: moveNowValue,
                waitAndHold: waitAndHoldValue,
                recommendation: moveNowValue > waitAndHoldValue ? 'MOVE_NOW' : 'WAIT',
            };
        };
        return ProfitCalculatorService_1;
    }());
    __setFunctionName(_classThis, "ProfitCalculatorService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProfitCalculatorService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProfitCalculatorService = _classThis;
}();
exports.ProfitCalculatorService = ProfitCalculatorService;
