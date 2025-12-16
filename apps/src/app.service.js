"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.AppService = void 0;
var common_1 = require("@nestjs/common");
var AppService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppService = _classThis = /** @class */ (function () {
        function AppService_1(prisma, blockchain, yieldScanner, decisionEngine) {
            this.prisma = prisma;
            this.blockchain = blockchain;
            this.yieldScanner = yieldScanner;
            this.decisionEngine = decisionEngine;
            this.logger = new common_1.Logger(AppService.name);
        }
        /**
         * Comprehensive health check for all services
         */
        AppService_1.prototype.getHealthCheck = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, database, blockchain, yieldScanner, decisionEngine, dbHealth, blockchainHealth, yieldHealth, decisionHealth, allHealthy, overallStatus, error_1;
                var _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            this.logger.debug('Running health check...');
                            _f.label = 1;
                        case 1:
                            _f.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Promise.allSettled([
                                    this.checkDatabase(),
                                    this.blockchain.healthCheck(),
                                    this.yieldScanner.healthCheck(),
                                    this.decisionEngine.healthCheck(),
                                ])];
                        case 2:
                            _a = _f.sent(), database = _a[0], blockchain = _a[1], yieldScanner = _a[2], decisionEngine = _a[3];
                            dbHealth = database.status === 'fulfilled' ? database.value : { status: 'unhealthy', error: (_b = database.reason) === null || _b === void 0 ? void 0 : _b.message };
                            blockchainHealth = blockchain.status === 'fulfilled' ? blockchain.value : { connected: false, error: (_c = blockchain.reason) === null || _c === void 0 ? void 0 : _c.message };
                            yieldHealth = yieldScanner.status === 'fulfilled' ? yieldScanner.value : { status: 'unhealthy', error: (_d = yieldScanner.reason) === null || _d === void 0 ? void 0 : _d.message };
                            decisionHealth = decisionEngine.status === 'fulfilled' ? decisionEngine.value : { status: 'unhealthy', error: (_e = decisionEngine.reason) === null || _e === void 0 ? void 0 : _e.message };
                            allHealthy = dbHealth.status === 'healthy' &&
                                blockchainHealth.connected &&
                                (yieldHealth.status === 'healthy' || yieldHealth.status === 'stale') &&
                                (decisionHealth.status === 'healthy' || decisionHealth.status === 'degraded');
                            overallStatus = allHealthy ? 'healthy' :
                                (dbHealth.status === 'healthy' && blockchainHealth.connected) ? 'degraded' : 'unhealthy';
                            return [2 /*return*/, {
                                    status: overallStatus,
                                    timestamp: new Date().toISOString(),
                                    uptime: process.uptime(),
                                    environment: process.env.NODE_ENV || 'development',
                                    services: {
                                        database: dbHealth,
                                        blockchain: this.formatBlockchainHealth(blockchainHealth),
                                        yieldScanner: yieldHealth,
                                        decisionEngine: decisionHealth,
                                    },
                                    metadata: {
                                        nodeVersion: process.version,
                                        platform: process.platform,
                                        arch: process.arch,
                                    },
                                }];
                        case 3:
                            error_1 = _f.sent();
                            this.logger.error('Health check failed:', error_1);
                            return [2 /*return*/, {
                                    status: 'unhealthy',
                                    timestamp: new Date().toISOString(),
                                    error: error_1.message,
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Check database connectivity
         */
        AppService_1.prototype.checkDatabase = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, vaultCount, protocolCount, decisionCount, error_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            // Simple query to verify connection
                            return [4 /*yield*/, this.prisma.client.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT 1"], ["SELECT 1"])))];
                        case 1:
                            // Simple query to verify connection
                            _b.sent();
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.client.vault.count(),
                                    this.prisma.client.protocol.count(),
                                    this.prisma.client.agentDecision.count(),
                                ])];
                        case 2:
                            _a = _b.sent(), vaultCount = _a[0], protocolCount = _a[1], decisionCount = _a[2];
                            return [2 /*return*/, {
                                    status: 'healthy',
                                    vaults: vaultCount,
                                    protocols: protocolCount,
                                    decisions: decisionCount,
                                }];
                        case 3:
                            error_2 = _b.sent();
                            this.logger.error('Database health check failed:', error_2);
                            return [2 /*return*/, {
                                    status: 'unhealthy',
                                    error: error_2.message,
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Format blockchain health data
         */
        AppService_1.prototype.formatBlockchainHealth = function (health) {
            var _a;
            if (!health.connected) {
                return {
                    status: 'unhealthy',
                    connected: false,
                    error: health.error,
                };
            }
            return {
                status: 'healthy',
                connected: true,
                blockNumber: (_a = health.blockNumber) === null || _a === void 0 ? void 0 : _a.toString(),
                gasPrice: health.gasPrice ? "".concat(Number(health.gasPrice) / 1e9, " gwei") : 'N/A',
                operatorBalance: health.operatorBalance ? "".concat(Number(health.operatorBalance) / 1e18, " MATIC") : 'N/A',
            };
        };
        /**
         * Get system statistics
         */
        AppService_1.prototype.getStatistics = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, totalVaults, activeVaults, totalDeposited, totalDecisions, successfulRebalances, error_3;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.client.vault.count(),
                                    this.prisma.client.vault.count({ where: { isActive: true } }),
                                    this.prisma.client.vault.aggregate({
                                        _sum: { totalDeposited: true },
                                    }),
                                    this.prisma.client.agentDecision.count(),
                                    this.prisma.client.agentDecision.count({
                                        where: { wasExecuted: true },
                                    }),
                                ])];
                        case 1:
                            _a = _b.sent(), totalVaults = _a[0], activeVaults = _a[1], totalDeposited = _a[2], totalDecisions = _a[3], successfulRebalances = _a[4];
                            return [2 /*return*/, {
                                    vaults: {
                                        total: totalVaults,
                                        active: activeVaults,
                                        inactive: totalVaults - activeVaults,
                                    },
                                    tvl: Number(totalDeposited._sum.totalDeposited || 0),
                                    decisions: {
                                        total: totalDecisions,
                                        executed: successfulRebalances,
                                        pending: totalDecisions - successfulRebalances,
                                    },
                                }];
                        case 2:
                            error_3 = _b.sent();
                            this.logger.error('Failed to get statistics:', error_3);
                            throw error_3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return AppService_1;
    }());
    __setFunctionName(_classThis, "AppService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppService = _classThis;
}();
exports.AppService = AppService;
var templateObject_1;
