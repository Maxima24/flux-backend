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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisionEngineController = void 0;
var common_1 = require("@nestjs/common");
var DecisionEngineController = function () {
    var _classDecorators = [(0, common_1.Controller)('decisions')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _evaluateVault_decorators;
    var _evaluateAllVaults_decorators;
    var _getDecisionHistory_decorators;
    var _getPendingRebalances_decorators;
    var _getStats_decorators;
    var _getPerformance_decorators;
    var _getLatestDecision_decorators;
    var _cancelDecision_decorators;
    var _markExecuted_decorators;
    var _getStrategies_decorators;
    var _healthCheck_decorators;
    var DecisionEngineController = _classThis = /** @class */ (function () {
        function DecisionEngineController_1(decisionEngine) {
            this.decisionEngine = (__runInitializers(this, _instanceExtraInitializers), decisionEngine);
        }
        /**
         * POST /decisions/evaluate/:vaultId
         * Evaluate a specific vault and return decision
         */
        DecisionEngineController_1.prototype.evaluateVault = function (vaultId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var decision, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.decisionEngine.evaluateVault(vaultId)];
                        case 1:
                            decision = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    vaultId: vaultId,
                                    decision: {
                                        shouldRebalance: decision.shouldRebalance,
                                        targetProtocol: decision.targetProtocol,
                                        currentState: {
                                            protocol: null, // Will be populated from vault
                                            apy: 0,
                                        },
                                        recommendation: decision.shouldRebalance ? {
                                            targetProtocol: decision.targetProtocol,
                                            expectedGainAPY: decision.expectedGainAPY,
                                        } : null,
                                        economics: decision.shouldRebalance ? {
                                            gasCostUSD: decision.gasCostUSD,
                                            netBenefitAPY: decision.netBenefitAPY,
                                        } : null,
                                        reasoning: decision.reasoning,
                                        metadata: decision.metadata,
                                    },
                                    timestamp: new Date().toISOString(),
                                }];
                        case 2:
                            error_1 = _a.sent();
                            if (error_1 instanceof common_1.NotFoundException) {
                                throw error_1;
                            }
                            throw new common_1.BadRequestException(error_1.message);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * POST /decisions/evaluate-all
         * Evaluate all active vaults
         */
        DecisionEngineController_1.prototype.evaluateAllVaults = function () {
            return __awaiter(this, void 0, void 0, function () {
                var decisions, results, rebalanceCount, holdCount, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.decisionEngine.evaluateAllVaults()];
                        case 1:
                            decisions = _a.sent();
                            results = Array.from(decisions.entries()).map(function (_a) {
                                var vaultId = _a[0], decision = _a[1];
                                return ({
                                    vaultId: vaultId,
                                    shouldRebalance: decision.shouldRebalance,
                                    targetProtocol: decision.targetProtocol,
                                    reasoning: decision.reasoning,
                                });
                            });
                            rebalanceCount = results.filter(function (r) { return r.shouldRebalance; }).length;
                            holdCount = results.filter(function (r) { return !r.shouldRebalance; }).length;
                            return [2 /*return*/, {
                                    success: true,
                                    summary: {
                                        total: results.length,
                                        rebalance: rebalanceCount,
                                        hold: holdCount,
                                    },
                                    decisions: results,
                                    timestamp: new Date().toISOString(),
                                }];
                        case 2:
                            error_2 = _a.sent();
                            throw new common_1.BadRequestException(error_2.message);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * GET /decisions/history/:vaultId
         * Get decision history for a vault
         */
        DecisionEngineController_1.prototype.getDecisionHistory = function (vaultId, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var historyLimit, history_1, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            historyLimit = limit ? parseInt(limit) : 50;
                            if (historyLimit < 1 || historyLimit > 100) {
                                throw new common_1.BadRequestException('Limit must be between 1 and 100');
                            }
                            return [4 /*yield*/, this.decisionEngine.getDecisionHistory(vaultId, historyLimit)];
                        case 1:
                            history_1 = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    vaultId: vaultId,
                                    count: history_1.length,
                                    decisions: history_1.map(function (d) {
                                        var _a, _b;
                                        return ({
                                            id: d.id,
                                            type: d.decisionType,
                                            fromProtocol: ((_a = d.fromProtocol) === null || _a === void 0 ? void 0 : _a.name) || null,
                                            toProtocol: ((_b = d.toProtocol) === null || _b === void 0 ? void 0 : _b.name) || null,
                                            expectedGainAPY: Number(d.expectedGainApy),
                                            gasCostUSD: Number(d.estimatedGasCost),
                                            netBenefitAPY: Number(d.netBenefitApy),
                                            wasExecuted: d.wasExecuted,
                                            reasoning: d.reason,
                                            createdAt: d.createdAt,
                                            transactions: d.transactions.map(function (tx) { return ({
                                                hash: tx.txHash,
                                                status: tx.status,
                                                gasUsed: tx.gasUsed ? Number(tx.gasUsed) : null,
                                            }); }),
                                        });
                                    }),
                                }];
                        case 2:
                            error_3 = _a.sent();
                            throw new common_1.BadRequestException(error_3.message);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * GET /decisions/pending
         * Get pending rebalance decisions (not yet executed)
         */
        DecisionEngineController_1.prototype.getPendingRebalances = function () {
            return __awaiter(this, void 0, void 0, function () {
                var pending, error_4;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.decisionEngine.getPendingRebalances()];
                        case 1:
                            pending = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    count: pending.length,
                                    decisions: pending.map(function (d) {
                                        var _a, _b;
                                        return ({
                                            id: d.id,
                                            vaultId: d.vaultId,
                                            vaultAddress: d.vault.contractAddress,
                                            fromProtocol: ((_a = d.vault.currentProtocol) === null || _a === void 0 ? void 0 : _a.name) || null,
                                            toProtocol: ((_b = d.toProtocol) === null || _b === void 0 ? void 0 : _b.name) || null,
                                            amount: Number(d.amount),
                                            expectedGainAPY: Number(d.expectedGainApy),
                                            gasCostUSD: Number(d.estimatedGasCost),
                                            reasoning: d.reason,
                                            createdAt: d.createdAt,
                                            age: _this.calculateAge(d.createdAt),
                                        });
                                    }),
                                }];
                        case 2:
                            error_4 = _a.sent();
                            throw new common_1.BadRequestException(error_4.message);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * GET /decisions/stats
         * Get decision statistics (optionally filtered by vault)
         */
        DecisionEngineController_1.prototype.getStats = function (vaultId) {
            return __awaiter(this, void 0, void 0, function () {
                var stats, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.decisionEngine.getDecisionStats(vaultId)];
                        case 1:
                            stats = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    vaultId: vaultId || 'all',
                                    stats: {
                                        total: stats.total,
                                        breakdown: {
                                            rebalances: stats.rebalances,
                                            holds: stats.holds,
                                            pending: stats.pending,
                                        },
                                        execution: {
                                            executed: stats.executed,
                                            successRate: "".concat(stats.successRate, "%"),
                                        },
                                        efficiency: {
                                            holdRate: "".concat(stats.holdRate, "%"),
                                        },
                                    },
                                }];
                        case 2:
                            error_5 = _a.sent();
                            throw new common_1.BadRequestException(error_5.message);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * GET /decisions/performance/:vaultId
         * Get theoretical performance analysis for a vault
         */
        DecisionEngineController_1.prototype.getPerformance = function (vaultId, days) {
            return __awaiter(this, void 0, void 0, function () {
                var period, performance_1, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            period = days ? parseInt(days) : 30;
                            if (period < 1 || period > 365) {
                                throw new common_1.BadRequestException('Days must be between 1 and 365');
                            }
                            return [4 /*yield*/, this.decisionEngine.calculateTheoreticalPerformance(vaultId, period)];
                        case 1:
                            performance_1 = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    vaultId: vaultId,
                                    performance: {
                                        period: performance_1.period,
                                        summary: {
                                            totalDecisions: performance_1.totalDecisions,
                                            rebalancesExecuted: performance_1.rebalancesExecuted,
                                        },
                                        gains: {
                                            totalExpectedAPY: "".concat(performance_1.totalExpectedGainAPY, "%"),
                                            totalGasCost: "$".concat(performance_1.totalGasCostUSD),
                                            netGainAPY: "".concat(performance_1.netGainAPY, "%"),
                                        },
                                        metrics: {
                                            averageGainPerMove: "".concat(performance_1.averageGainPerMove, "%"),
                                            efficiency: "".concat(performance_1.efficiency, "%"),
                                        },
                                    },
                                }];
                        case 2:
                            error_6 = _a.sent();
                            throw new common_1.BadRequestException(error_6.message);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * GET /decisions/latest/:vaultId
         * Get the most recent decision for a vault
         */
        DecisionEngineController_1.prototype.getLatestDecision = function (vaultId) {
            return __awaiter(this, void 0, void 0, function () {
                var decision, error_7;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.decisionEngine.getLatestDecision(vaultId)];
                        case 1:
                            decision = _c.sent();
                            if (!decision) {
                                return [2 /*return*/, {
                                        success: false,
                                        message: 'No decisions found for this vault',
                                    }];
                            }
                            return [2 /*return*/, {
                                    success: true,
                                    vaultId: vaultId,
                                    decision: {
                                        id: decision.id,
                                        type: decision.decisionType,
                                        fromProtocol: ((_a = decision.fromProtocol) === null || _a === void 0 ? void 0 : _a.name) || null,
                                        toProtocol: ((_b = decision.toProtocol) === null || _b === void 0 ? void 0 : _b.name) || null,
                                        expectedGainAPY: Number(decision.expectedGainApy),
                                        gasCostUSD: Number(decision.estimatedGasCost),
                                        netBenefitAPY: Number(decision.netBenefitApy),
                                        wasExecuted: decision.wasExecuted,
                                        reasoning: decision.reason,
                                        createdAt: decision.createdAt,
                                        age: this.calculateAge(decision.createdAt),
                                    },
                                }];
                        case 2:
                            error_7 = _c.sent();
                            throw new common_1.BadRequestException(error_7.message);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * POST /decisions/:decisionId/cancel
         * Cancel a pending decision
         */
        DecisionEngineController_1.prototype.cancelDecision = function (decisionId) {
            return __awaiter(this, void 0, void 0, function () {
                var error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.decisionEngine.cancelDecision(decisionId)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Decision cancelled successfully',
                                    decisionId: decisionId,
                                }];
                        case 2:
                            error_8 = _a.sent();
                            if (error_8 instanceof common_1.NotFoundException) {
                                throw error_8;
                            }
                            throw new common_1.BadRequestException(error_8.message);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * POST /decisions/:decisionId/mark-executed
         * Mark a decision as executed (used by executor)
         */
        DecisionEngineController_1.prototype.markExecuted = function (decisionId) {
            return __awaiter(this, void 0, void 0, function () {
                var error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.decisionEngine.markDecisionExecuted(decisionId)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Decision marked as executed',
                                    decisionId: decisionId,
                                }];
                        case 2:
                            error_9 = _a.sent();
                            throw new common_1.BadRequestException(error_9.message);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * GET /decisions/strategies
         * Get list of available strategies
         */
        DecisionEngineController_1.prototype.getStrategies = function () {
            var _this = this;
            var strategies = this.decisionEngine.getAvailableStrategies();
            return {
                success: true,
                strategies: strategies.map(function (name) { return ({
                    name: name,
                    description: _this.getStrategyDescription(name),
                }); }),
            };
        };
        /**
         * GET /decisions/health
         * Decision engine health check
         */
        DecisionEngineController_1.prototype.healthCheck = function () {
            return __awaiter(this, void 0, void 0, function () {
                var health, error_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.decisionEngine.healthCheck()];
                        case 1:
                            health = _a.sent();
                            return [2 /*return*/, __assign({ success: true }, health)];
                        case 2:
                            error_10 = _a.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    status: 'unhealthy',
                                    error: error_10.message,
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================================
        // HELPER METHODS
        // ============================================
        DecisionEngineController_1.prototype.calculateAge = function (date) {
            var now = new Date();
            var diff = now.getTime() - date.getTime();
            var seconds = Math.floor(diff / 1000);
            var minutes = Math.floor(seconds / 60);
            var hours = Math.floor(minutes / 60);
            var days = Math.floor(hours / 24);
            if (days > 0)
                return "".concat(days, "d ").concat(hours % 24, "h ago");
            if (hours > 0)
                return "".concat(hours, "h ").concat(minutes % 60, "m ago");
            if (minutes > 0)
                return "".concat(minutes, "m ").concat(seconds % 60, "s ago");
            return "".concat(seconds, "s ago");
        };
        DecisionEngineController_1.prototype.getStrategyDescription = function (name) {
            var descriptions = {
                'yield-optimizer': 'Aggressive strategy that maximizes APY gains with moderate risk tolerance',
                'conservative': 'Conservative strategy with higher thresholds and longer rebalance intervals',
            };
            return descriptions[name] || 'No description available';
        };
        return DecisionEngineController_1;
    }());
    __setFunctionName(_classThis, "DecisionEngineController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _evaluateVault_decorators = [(0, common_1.Post)('evaluate/:vaultId'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
        _evaluateAllVaults_decorators = [(0, common_1.Post)('evaluate-all'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
        _getDecisionHistory_decorators = [(0, common_1.Get)('history/:vaultId')];
        _getPendingRebalances_decorators = [(0, common_1.Get)('pending')];
        _getStats_decorators = [(0, common_1.Get)('stats')];
        _getPerformance_decorators = [(0, common_1.Get)('performance/:vaultId')];
        _getLatestDecision_decorators = [(0, common_1.Get)('latest/:vaultId')];
        _cancelDecision_decorators = [(0, common_1.Post)(':decisionId/cancel'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
        _markExecuted_decorators = [(0, common_1.Post)(':decisionId/mark-executed'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
        _getStrategies_decorators = [(0, common_1.Get)('strategies')];
        _healthCheck_decorators = [(0, common_1.Get)('health')];
        __esDecorate(_classThis, null, _evaluateVault_decorators, { kind: "method", name: "evaluateVault", static: false, private: false, access: { has: function (obj) { return "evaluateVault" in obj; }, get: function (obj) { return obj.evaluateVault; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _evaluateAllVaults_decorators, { kind: "method", name: "evaluateAllVaults", static: false, private: false, access: { has: function (obj) { return "evaluateAllVaults" in obj; }, get: function (obj) { return obj.evaluateAllVaults; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDecisionHistory_decorators, { kind: "method", name: "getDecisionHistory", static: false, private: false, access: { has: function (obj) { return "getDecisionHistory" in obj; }, get: function (obj) { return obj.getDecisionHistory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPendingRebalances_decorators, { kind: "method", name: "getPendingRebalances", static: false, private: false, access: { has: function (obj) { return "getPendingRebalances" in obj; }, get: function (obj) { return obj.getPendingRebalances; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStats_decorators, { kind: "method", name: "getStats", static: false, private: false, access: { has: function (obj) { return "getStats" in obj; }, get: function (obj) { return obj.getStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPerformance_decorators, { kind: "method", name: "getPerformance", static: false, private: false, access: { has: function (obj) { return "getPerformance" in obj; }, get: function (obj) { return obj.getPerformance; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getLatestDecision_decorators, { kind: "method", name: "getLatestDecision", static: false, private: false, access: { has: function (obj) { return "getLatestDecision" in obj; }, get: function (obj) { return obj.getLatestDecision; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _cancelDecision_decorators, { kind: "method", name: "cancelDecision", static: false, private: false, access: { has: function (obj) { return "cancelDecision" in obj; }, get: function (obj) { return obj.cancelDecision; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _markExecuted_decorators, { kind: "method", name: "markExecuted", static: false, private: false, access: { has: function (obj) { return "markExecuted" in obj; }, get: function (obj) { return obj.markExecuted; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStrategies_decorators, { kind: "method", name: "getStrategies", static: false, private: false, access: { has: function (obj) { return "getStrategies" in obj; }, get: function (obj) { return obj.getStrategies; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _healthCheck_decorators, { kind: "method", name: "healthCheck", static: false, private: false, access: { has: function (obj) { return "healthCheck" in obj; }, get: function (obj) { return obj.healthCheck; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DecisionEngineController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DecisionEngineController = _classThis;
}();
exports.DecisionEngineController = DecisionEngineController;
