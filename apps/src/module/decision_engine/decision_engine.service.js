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
exports.DecisionEngineService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var DecisionEngineService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DecisionEngineService = _classThis = /** @class */ (function () {
        function DecisionEngineService_1(prisma, yieldScanner, yieldOptimizer, conservative) {
            this.prisma = prisma;
            this.yieldScanner = yieldScanner;
            this.yieldOptimizer = yieldOptimizer;
            this.conservative = conservative;
            this.logger = new common_1.Logger(DecisionEngineService.name);
            // Register available strategies
            this.strategies = new Map([
                ['yield-optimizer', this.yieldOptimizer],
                ['conservative', this.conservative],
            ]);
        }
        /**
         * Evaluate a vault and make rebalancing decision
         */
        DecisionEngineService_1.prototype.evaluateVault = function (vaultId) {
            return __awaiter(this, void 0, void 0, function () {
                var vault, position, availableYields, strategy, decision;
                var _a;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            this.logger.log("Evaluating vault: ".concat(vaultId));
                            return [4 /*yield*/, this.prisma.client.vault.findUnique({
                                    where: { id: vaultId },
                                    include: { currentProtocol: true },
                                })];
                        case 1:
                            vault = _c.sent();
                            if (!vault) {
                                throw new common_1.NotFoundException("Vault ".concat(vaultId, " not found"));
                            }
                            if (!vault.isActive) {
                                this.logger.warn("Vault ".concat(vaultId, " is not active"));
                                return [2 /*return*/, {
                                        shouldRebalance: false,
                                        targetProtocol: null,
                                        expectedGainAPY: 0,
                                        gasCostUSD: 0,
                                        netBenefitAPY: 0,
                                        reasoning: 'Vault is not active',
                                        metadata: {},
                                    }];
                            }
                            _a = {
                                vaultId: vault.id,
                                vaultAddress: vault.contractAddress,
                                asset: vault.currentAsset,
                                amount: Number(vault.currentBalance),
                                currentProtocol: ((_b = vault.currentProtocol) === null || _b === void 0 ? void 0 : _b.name) || null
                            };
                            return [4 /*yield*/, this.getCurrentAPY(vault.currentProtocolId)];
                        case 2:
                            position = (_a.currentAPY = _c.sent(),
                                _a.lastRebalance = vault.lastRebalance || undefined,
                                _a);
                            // Check if position has sufficient balance
                            if (position.amount <= 0) {
                                this.logger.warn("Vault ".concat(vaultId, " has zero balance"));
                                return [2 /*return*/, {
                                        shouldRebalance: false,
                                        targetProtocol: null,
                                        expectedGainAPY: 0,
                                        gasCostUSD: 0,
                                        netBenefitAPY: 0,
                                        reasoning: 'Vault has no balance',
                                        metadata: {},
                                    }];
                            }
                            return [4 /*yield*/, this.yieldScanner.getAllYields(vault.currentAsset)];
                        case 3:
                            availableYields = _c.sent();
                            if (!availableYields || availableYields.length === 0) {
                                this.logger.warn("No yield data available for ".concat(vault.currentAsset));
                                return [2 /*return*/, {
                                        shouldRebalance: false,
                                        targetProtocol: null,
                                        expectedGainAPY: 0,
                                        gasCostUSD: 0,
                                        netBenefitAPY: 0,
                                        reasoning: 'No yield data available',
                                        metadata: {},
                                    }];
                            }
                            strategy = this.strategies.get(vault.strategy);
                            if (!strategy) {
                                this.logger.error("Unknown strategy: ".concat(vault.strategy));
                                throw new Error("Strategy ".concat(vault.strategy, " not found"));
                            }
                            return [4 /*yield*/, strategy.evaluate(position, availableYields)];
                        case 4:
                            decision = _c.sent();
                            // Log decision to database
                            return [4 /*yield*/, this.logDecision(vault.id, decision)];
                        case 5:
                            // Log decision to database
                            _c.sent();
                            this.logger.log("Decision for vault ".concat(vaultId, ": ").concat(decision.shouldRebalance ? 'REBALANCE' : 'HOLD', " - ").concat(decision.reasoning));
                            return [2 /*return*/, decision];
                    }
                });
            });
        };
        /**
         * Evaluate all active vaults
         */
        DecisionEngineService_1.prototype.evaluateAllVaults = function () {
            return __awaiter(this, void 0, void 0, function () {
                var activeVaults, decisions, _i, activeVaults_1, vault, decision, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.client.vault.findMany({
                                where: { isActive: true },
                            })];
                        case 1:
                            activeVaults = _a.sent();
                            this.logger.log("Evaluating ".concat(activeVaults.length, " active vaults"));
                            decisions = new Map();
                            _i = 0, activeVaults_1 = activeVaults;
                            _a.label = 2;
                        case 2:
                            if (!(_i < activeVaults_1.length)) return [3 /*break*/, 7];
                            vault = activeVaults_1[_i];
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.evaluateVault(vault.id)];
                        case 4:
                            decision = _a.sent();
                            decisions.set(vault.id, decision);
                            return [3 /*break*/, 6];
                        case 5:
                            error_1 = _a.sent();
                            this.logger.error("Failed to evaluate vault ".concat(vault.id, ":"), error_1);
                            return [3 /*break*/, 6];
                        case 6:
                            _i++;
                            return [3 /*break*/, 2];
                        case 7:
                            this.logger.log("Completed evaluation. ".concat(decisions.size, " decisions made"));
                            return [2 /*return*/, decisions];
                    }
                });
            });
        };
        /**
         * Get current APY for a protocol
         */
        DecisionEngineService_1.prototype.getCurrentAPY = function (protocolId) {
            return __awaiter(this, void 0, void 0, function () {
                var latestSnapshot, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!protocolId)
                                return [2 /*return*/, 0];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.prisma.client.yieldSnapshot.findFirst({
                                    where: { protocolId: protocolId },
                                    orderBy: { timestamp: 'desc' },
                                })];
                        case 2:
                            latestSnapshot = _a.sent();
                            return [2 /*return*/, latestSnapshot ? Number(latestSnapshot.apy) : 0];
                        case 3:
                            error_2 = _a.sent();
                            this.logger.error("Failed to get current APY for protocol ".concat(protocolId, ":"), error_2);
                            return [2 /*return*/, 0];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Log decision to database for audit trail
         */
        DecisionEngineService_1.prototype.logDecision = function (vaultId, decision) {
            return __awaiter(this, void 0, void 0, function () {
                var vault, toProtocolId, targetProtocol, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, this.prisma.client.vault.findUnique({
                                    where: { id: vaultId },
                                    include: { currentProtocol: true },
                                })];
                        case 1:
                            vault = _a.sent();
                            if (!vault) {
                                this.logger.error("Cannot log decision: Vault ".concat(vaultId, " not found"));
                                return [2 /*return*/];
                            }
                            toProtocolId = null;
                            if (!decision.targetProtocol) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.client.protocol.findUnique({
                                    where: { name: decision.targetProtocol },
                                })];
                        case 2:
                            targetProtocol = _a.sent();
                            toProtocolId = (targetProtocol === null || targetProtocol === void 0 ? void 0 : targetProtocol.id) || null;
                            if (!toProtocolId) {
                                this.logger.warn("Target protocol ".concat(decision.targetProtocol, " not found in database"));
                            }
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.prisma.client.agentDecision.create({
                                data: {
                                    vaultId: vaultId,
                                    decisionType: decision.shouldRebalance
                                        ? client_1.DecisionType.REBALANCE
                                        : client_1.DecisionType.HOLD,
                                    fromProtocolId: vault.currentProtocolId,
                                    toProtocolId: toProtocolId,
                                    amount: vault.currentBalance,
                                    expectedGainApy: decision.expectedGainAPY,
                                    estimatedGasCost: decision.gasCostUSD,
                                    netBenefitApy: decision.netBenefitAPY,
                                    wasExecuted: false,
                                    reason: decision.reasoning,
                                    metadata: decision.metadata || {},
                                },
                            })];
                        case 4:
                            _a.sent();
                            this.logger.debug("Decision logged for vault ".concat(vaultId));
                            return [3 /*break*/, 6];
                        case 5:
                            error_3 = _a.sent();
                            this.logger.error("Failed to log decision for vault ".concat(vaultId, ":"), error_3);
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get decision history for a vault
         */
        DecisionEngineService_1.prototype.getDecisionHistory = function (vaultId_1) {
            return __awaiter(this, arguments, void 0, function (vaultId, limit) {
                if (limit === void 0) { limit = 50; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.client.agentDecision.findMany({
                            where: { vaultId: vaultId },
                            include: {
                                fromProtocol: true,
                                toProtocol: true,
                                transactions: true,
                            },
                            orderBy: { createdAt: 'desc' },
                            take: limit,
                        })];
                });
            });
        };
        /**
         * Get rebalance decisions pending execution
         */
        DecisionEngineService_1.prototype.getPendingRebalances = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.client.agentDecision.findMany({
                            where: {
                                decisionType: client_1.DecisionType.REBALANCE,
                                wasExecuted: false,
                                createdAt: {
                                    gte: new Date(Date.now() - 30 * 60 * 1000), // Last 30 minutes
                                },
                            },
                            include: {
                                vault: true,
                                toProtocol: true,
                            },
                            orderBy: { createdAt: 'desc' },
                        })];
                });
            });
        };
        /**
         * Mark decision as executed
         */
        DecisionEngineService_1.prototype.markDecisionExecuted = function (decisionId) {
            return __awaiter(this, void 0, void 0, function () {
                var error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.prisma.client.agentDecision.update({
                                    where: { id: decisionId },
                                    data: { wasExecuted: true },
                                })];
                        case 1:
                            _a.sent();
                            this.logger.debug("Decision ".concat(decisionId, " marked as executed"));
                            return [3 /*break*/, 3];
                        case 2:
                            error_4 = _a.sent();
                            this.logger.error("Failed to mark decision ".concat(decisionId, " as executed:"), error_4);
                            throw error_4;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get decision statistics
         */
        DecisionEngineService_1.prototype.getDecisionStats = function (vaultId) {
            return __awaiter(this, void 0, void 0, function () {
                var where, _a, total, rebalances, holds, executed, successRate, error_5;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            where = vaultId ? { vaultId: vaultId } : {};
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.client.agentDecision.count({ where: where }),
                                    this.prisma.client.agentDecision.count({
                                        where: __assign(__assign({}, where), { decisionType: client_1.DecisionType.REBALANCE }),
                                    }),
                                    this.prisma.client.agentDecision.count({
                                        where: __assign(__assign({}, where), { decisionType: client_1.DecisionType.HOLD }),
                                    }),
                                    this.prisma.client.agentDecision.count({
                                        where: __assign(__assign({}, where), { wasExecuted: true }),
                                    }),
                                ])];
                        case 2:
                            _a = _b.sent(), total = _a[0], rebalances = _a[1], holds = _a[2], executed = _a[3];
                            successRate = rebalances > 0 ? (executed / rebalances) * 100 : 0;
                            return [2 /*return*/, {
                                    total: total,
                                    rebalances: rebalances,
                                    holds: holds,
                                    executed: executed,
                                    pending: rebalances - executed,
                                    successRate: parseFloat(successRate.toFixed(2)),
                                    holdRate: total > 0 ? parseFloat(((holds / total) * 100).toFixed(2)) : 0,
                                }];
                        case 3:
                            error_5 = _b.sent();
                            this.logger.error('Failed to get decision stats:', error_5);
                            throw error_5;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Calculate theoretical performance (backtest)
         */
        DecisionEngineService_1.prototype.calculateTheoreticalPerformance = function (vaultId_1) {
            return __awaiter(this, arguments, void 0, function (vaultId, days) {
                var cutoffDate, decisions, totalGainAPY, totalGasCost, executedCount, _i, decisions_1, decision, netGainAPY, averageGainPerMove, error_6;
                if (days === void 0) { days = 30; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.prisma.client.agentDecision.findMany({
                                    where: {
                                        vaultId: vaultId,
                                        createdAt: { gte: cutoffDate },
                                    },
                                    orderBy: { createdAt: 'asc' },
                                })];
                        case 2:
                            decisions = _a.sent();
                            totalGainAPY = 0;
                            totalGasCost = 0;
                            executedCount = 0;
                            for (_i = 0, decisions_1 = decisions; _i < decisions_1.length; _i++) {
                                decision = decisions_1[_i];
                                if (decision.wasExecuted && decision.decisionType === client_1.DecisionType.REBALANCE) {
                                    totalGainAPY += Number(decision.expectedGainApy);
                                    totalGasCost += Number(decision.estimatedGasCost);
                                    executedCount++;
                                }
                            }
                            netGainAPY = totalGainAPY - (totalGasCost > 0 ? totalGasCost : 0);
                            averageGainPerMove = executedCount > 0 ? totalGainAPY / executedCount : 0;
                            return [2 /*return*/, {
                                    period: "".concat(days, " days"),
                                    totalDecisions: decisions.length,
                                    rebalancesExecuted: executedCount,
                                    totalExpectedGainAPY: parseFloat(totalGainAPY.toFixed(4)),
                                    totalGasCostUSD: parseFloat(totalGasCost.toFixed(4)),
                                    netGainAPY: parseFloat(netGainAPY.toFixed(4)),
                                    averageGainPerMove: parseFloat(averageGainPerMove.toFixed(4)),
                                    efficiency: totalGasCost > 0
                                        ? parseFloat(((totalGainAPY / totalGasCost) * 100).toFixed(2))
                                        : 0,
                                }];
                        case 3:
                            error_6 = _a.sent();
                            this.logger.error("Failed to calculate performance for vault ".concat(vaultId, ":"), error_6);
                            throw error_6;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get latest decision for a vault
         */
        DecisionEngineService_1.prototype.getLatestDecision = function (vaultId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.client.agentDecision.findFirst({
                            where: { vaultId: vaultId },
                            include: {
                                fromProtocol: true,
                                toProtocol: true,
                            },
                            orderBy: { createdAt: 'desc' },
                        })];
                });
            });
        };
        /**
         * Cancel pending rebalance decision
         */
        DecisionEngineService_1.prototype.cancelDecision = function (decisionId) {
            return __awaiter(this, void 0, void 0, function () {
                var decision, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.prisma.client.agentDecision.findUnique({
                                    where: { id: decisionId },
                                })];
                        case 1:
                            decision = _a.sent();
                            if (!decision) {
                                throw new common_1.NotFoundException("Decision ".concat(decisionId, " not found"));
                            }
                            if (decision.wasExecuted) {
                                throw new Error('Cannot cancel already executed decision');
                            }
                            // Update decision type to indicate cancellation
                            return [4 /*yield*/, this.prisma.client.agentDecision.update({
                                    where: { id: decisionId },
                                    data: {
                                        decisionType: client_1.DecisionType.HOLD,
                                        reason: "".concat(decision.reason, " [CANCELLED]"),
                                    },
                                })];
                        case 2:
                            // Update decision type to indicate cancellation
                            _a.sent();
                            this.logger.log("Decision ".concat(decisionId, " cancelled"));
                            return [3 /*break*/, 4];
                        case 3:
                            error_7 = _a.sent();
                            this.logger.error("Failed to cancel decision ".concat(decisionId, ":"), error_7);
                            throw error_7;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get all strategies available
         */
        DecisionEngineService_1.prototype.getAvailableStrategies = function () {
            return Array.from(this.strategies.keys());
        };
        /**
         * Health check for decision engine
         */
        DecisionEngineService_1.prototype.healthCheck = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, activeVaults, pendingDecisions, lastDecision, oneHourAgo, hasRecentActivity, status_1, error_8;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.client.vault.count({ where: { isActive: true } }),
                                    this.prisma.client.agentDecision.count({
                                        where: {
                                            decisionType: client_1.DecisionType.REBALANCE,
                                            wasExecuted: false,
                                        },
                                    }),
                                    this.prisma.client.agentDecision.findFirst({
                                        orderBy: { createdAt: 'desc' },
                                        select: { createdAt: true },
                                    }),
                                ])];
                        case 1:
                            _a = _b.sent(), activeVaults = _a[0], pendingDecisions = _a[1], lastDecision = _a[2];
                            oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
                            hasRecentActivity = lastDecision && lastDecision.createdAt > oneHourAgo;
                            if (activeVaults === 0) {
                                status_1 = 'healthy'; // No vaults to evaluate
                            }
                            else if (!hasRecentActivity) {
                                status_1 = 'degraded'; // No recent decisions
                            }
                            else {
                                status_1 = 'healthy';
                            }
                            return [2 /*return*/, {
                                    status: status_1,
                                    activeVaults: activeVaults,
                                    pendingDecisions: pendingDecisions,
                                    lastEvaluationTime: lastDecision === null || lastDecision === void 0 ? void 0 : lastDecision.createdAt,
                                }];
                        case 2:
                            error_8 = _b.sent();
                            this.logger.error('Health check failed:', error_8);
                            return [2 /*return*/, {
                                    status: 'unhealthy',
                                    activeVaults: 0,
                                    pendingDecisions: 0,
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return DecisionEngineService_1;
    }());
    __setFunctionName(_classThis, "DecisionEngineService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DecisionEngineService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DecisionEngineService = _classThis;
}();
exports.DecisionEngineService = DecisionEngineService;
