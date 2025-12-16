"use strict";
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
exports.YieldScannerService = void 0;
var common_1 = require("@nestjs/common");
var schedule_1 = require("@nestjs/schedule");
var YieldScannerService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _scheduledYieldScan_decorators;
    var YieldScannerService = _classThis = /** @class */ (function () {
        function YieldScannerService_1(prisma, cacheManager, aaveProvider, quickswapProvider, defillamaProvider) {
            this.prisma = (__runInitializers(this, _instanceExtraInitializers), prisma);
            this.cacheManager = cacheManager;
            this.aaveProvider = aaveProvider;
            this.quickswapProvider = quickswapProvider;
            this.defillamaProvider = defillamaProvider;
            this.logger = new common_1.Logger(YieldScannerService.name);
        }
        /**
         * Scheduled job - runs every 5 minutes
         */
        YieldScannerService_1.prototype.scheduledYieldScan = function () {
            return __awaiter(this, void 0, void 0, function () {
                var yields, usdtYields, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log('🔄 Starting scheduled yield scan...');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, this.scanAllProtocols('USDC')];
                        case 2:
                            yields = _a.sent();
                            this.logger.log("\u2705 Scanned ".concat(yields.length, " protocols"));
                            return [4 /*yield*/, this.scanAllProtocols('USDT')];
                        case 3:
                            usdtYields = _a.sent();
                            this.logger.log("\u2705 Scanned ".concat(usdtYields.length, " protocols for USDT"));
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            this.logger.error('❌ Yield scan failed:', error_1);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Main orchestration - fetch all yields for an asset
         */
        YieldScannerService_1.prototype.scanAllProtocols = function () {
            return __awaiter(this, arguments, void 0, function (asset) {
                var protocols, results, validYields, failures;
                var _this = this;
                if (asset === void 0) { asset = 'USDC'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.client.protocol.findMany({
                                where: { isActive: true },
                            })];
                        case 1:
                            protocols = _a.sent();
                            this.logger.debug("Scanning ".concat(protocols.length, " protocols for ").concat(asset));
                            return [4 /*yield*/, Promise.allSettled(protocols.map(function (p) { return _this.fetchProtocolYield(p.name, asset); }))];
                        case 2:
                            results = _a.sent();
                            validYields = results
                                .filter(function (r) { return r.status === 'fulfilled'; })
                                .map(function (r) { return r.value; });
                            failures = results.filter(function (r) { return r.status === 'rejected'; });
                            if (failures.length > 0) {
                                this.logger.warn("".concat(failures.length, " protocols failed to fetch"));
                            }
                            // Cache in Redis
                            return [4 /*yield*/, this.cacheYields(validYields)];
                        case 3:
                            // Cache in Redis
                            _a.sent();
                            // Persist to Postgres
                            return [4 /*yield*/, this.persistYields(validYields)];
                        case 4:
                            // Persist to Postgres
                            _a.sent();
                            return [2 /*return*/, validYields];
                    }
                });
            });
        };
        /**
         * Fetch yield from specific protocol (with fallback)
         */
        YieldScannerService_1.prototype.fetchProtocolYield = function (protocol, asset) {
            return __awaiter(this, void 0, void 0, function () {
                var error_2, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 9]);
                            return [4 /*yield*/, this.defillamaProvider.getYield(protocol, asset)];
                        case 1: 
                        // Try DeFiLlama first (fast aggregator)
                        return [2 /*return*/, _b.sent()];
                        case 2:
                            error_2 = _b.sent();
                            this.logger.warn("DeFiLlama failed for ".concat(protocol, ", using direct read"));
                            _a = protocol.toLowerCase();
                            switch (_a) {
                                case 'aave': return [3 /*break*/, 3];
                                case 'quickswap': return [3 /*break*/, 5];
                            }
                            return [3 /*break*/, 7];
                        case 3: return [4 /*yield*/, this.aaveProvider.getYield(asset)];
                        case 4: return [2 /*return*/, _b.sent()];
                        case 5: return [4 /*yield*/, this.quickswapProvider.getYield(asset)];
                        case 6: return [2 /*return*/, _b.sent()];
                        case 7: throw new Error("Unsupported protocol: ".concat(protocol));
                        case 8: return [3 /*break*/, 9];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Cache yields in Redis
         */
        YieldScannerService_1.prototype.cacheYields = function (yields) {
            return __awaiter(this, void 0, void 0, function () {
                var error_3;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, Promise.all(yields.map(function (y) {
                                    return _this.cacheManager.set("yields:".concat(y.asset, ":").concat(y.protocol), y, 300 // 5 min TTL
                                    );
                                }))];
                        case 1:
                            _a.sent();
                            this.logger.debug("Cached ".concat(yields.length, " yields"));
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            this.logger.error('Failed to cache yields:', error_3);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Persist to Postgres via Prisma
         */
        YieldScannerService_1.prototype.persistYields = function (yields) {
            return __awaiter(this, void 0, void 0, function () {
                var protocols, protocolMap_1, validYields, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.prisma.client.protocol.findMany({
                                    where: {
                                        name: { in: yields.map(function (y) { return y.protocol; }) },
                                    },
                                })];
                        case 1:
                            protocols = _a.sent();
                            protocolMap_1 = new Map(protocols.map(function (p) { return [p.name, p.id]; }));
                            validYields = yields.filter(function (y) { return protocolMap_1.has(y.protocol); });
                            if (validYields.length === 0) {
                                this.logger.warn('No valid yields to persist');
                                return [2 /*return*/];
                            }
                            // Bulk insert (Prisma createMany)
                            return [4 /*yield*/, this.prisma.client.yieldSnapshot.createMany({
                                    data: validYields.map(function (y) { return ({
                                        protocolId: protocolMap_1.get(y.protocol),
                                        asset: y.asset,
                                        apy: y.apy,
                                        tvl: y.tvl || 0,
                                        source: y.source,
                                        metadata: y.metadata || {},
                                    }); }),
                                })];
                        case 2:
                            // Bulk insert (Prisma createMany)
                            _a.sent();
                            this.logger.debug("Persisted ".concat(validYields.length, " yields to database"));
                            return [3 /*break*/, 4];
                        case 3:
                            error_4 = _a.sent();
                            this.logger.error('Failed to persist yields:', error_4);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get best yield (from cache if available)
         */
        YieldScannerService_1.prototype.getBestYield = function (asset) {
            return __awaiter(this, void 0, void 0, function () {
                var cachePattern, keys, cachedYields, validYields, error_5;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            cachePattern = "yields:".concat(asset, ":*");
                            return [4 /*yield*/, this.getCacheKeys(cachePattern)];
                        case 1:
                            keys = _a.sent();
                            if (!(keys.length > 0)) return [3 /*break*/, 3];
                            return [4 /*yield*/, Promise.all(keys.map(function (key) { return _this.cacheManager.get(key); }))];
                        case 2:
                            cachedYields = _a.sent();
                            validYields = cachedYields.filter(function (y) { return y !== null; });
                            if (validYields.length > 0) {
                                return [2 /*return*/, validYields.reduce(function (best, current) {
                                        return current.apy > best.apy ? current : best;
                                    })];
                            }
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.getBestYieldFromDB(asset)];
                        case 4: 
                        // Cache miss - query database
                        return [2 /*return*/, _a.sent()];
                        case 5:
                            error_5 = _a.sent();
                            this.logger.error("Failed to get best yield for ".concat(asset, ":"), error_5);
                            return [2 /*return*/, null];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get best yield from database
         */
        YieldScannerService_1.prototype.getBestYieldFromDB = function (asset) {
            return __awaiter(this, void 0, void 0, function () {
                var latest, bestSnapshot;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.client.yieldSnapshot.findMany({
                                where: { asset: asset },
                                orderBy: { timestamp: 'desc' },
                                take: 10,
                                distinct: ['protocolId'],
                                include: { protocol: true },
                            })];
                        case 1:
                            latest = _b.sent();
                            if (latest.length === 0)
                                return [2 /*return*/, null];
                            bestSnapshot = latest.reduce(function (best, current) {
                                return current.apy > best.apy ? current : best;
                            });
                            return [2 /*return*/, {
                                    protocol: bestSnapshot.protocol.name,
                                    asset: bestSnapshot.asset,
                                    apy: bestSnapshot.apy.toNumber(),
                                    tvl: ((_a = bestSnapshot.tvl) === null || _a === void 0 ? void 0 : _a.toNumber()) || 0,
                                    source: bestSnapshot.source,
                                    timestamp: bestSnapshot.timestamp,
                                }];
                    }
                });
            });
        };
        /**
         * Get all yields for an asset
         */
        YieldScannerService_1.prototype.getAllYields = function (asset) {
            return __awaiter(this, void 0, void 0, function () {
                var cachePattern, keys, cachedYields, validYields, error_6;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            cachePattern = "yields:".concat(asset, ":*");
                            return [4 /*yield*/, this.getCacheKeys(cachePattern)];
                        case 1:
                            keys = _a.sent();
                            if (!(keys.length > 0)) return [3 /*break*/, 3];
                            return [4 /*yield*/, Promise.all(keys.map(function (key) { return _this.cacheManager.get(key); }))];
                        case 2:
                            cachedYields = _a.sent();
                            validYields = cachedYields.filter(function (y) { return y !== null; });
                            if (validYields.length > 0) {
                                this.logger.debug("Returning ".concat(validYields.length, " yields from cache"));
                                return [2 /*return*/, validYields];
                            }
                            _a.label = 3;
                        case 3:
                            // Cache miss - query database
                            this.logger.debug('Cache miss, fetching from database');
                            return [4 /*yield*/, this.getAllYieldsFromDB(asset)];
                        case 4: return [2 /*return*/, _a.sent()];
                        case 5:
                            error_6 = _a.sent();
                            this.logger.error("Failed to get all yields for ".concat(asset, ":"), error_6);
                            return [2 /*return*/, []];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get all yields from database
         */
        YieldScannerService_1.prototype.getAllYieldsFromDB = function (asset) {
            return __awaiter(this, void 0, void 0, function () {
                var snapshots;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.client.yieldSnapshot.findMany({
                                where: { asset: asset },
                                orderBy: { timestamp: 'desc' },
                                distinct: ['protocolId'],
                                take: 20,
                                include: { protocol: true },
                            })];
                        case 1:
                            snapshots = _a.sent();
                            return [2 /*return*/, snapshots.map(function (s) {
                                    var _a;
                                    return ({
                                        protocol: s.protocol.name,
                                        asset: s.asset,
                                        apy: s.apy.toNumber(),
                                        tvl: ((_a = s.tvl) === null || _a === void 0 ? void 0 : _a.toNumber()) || 0,
                                        source: s.source,
                                        timestamp: s.timestamp,
                                    });
                                })];
                    }
                });
            });
        };
        /**
         * Get yield for specific protocol
         */
        YieldScannerService_1.prototype.getProtocolYield = function (protocol, asset) {
            return __awaiter(this, void 0, void 0, function () {
                var cached, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.cacheManager.get("yields:".concat(asset, ":").concat(protocol))];
                        case 1:
                            cached = _a.sent();
                            if (cached)
                                return [2 /*return*/, cached];
                            return [4 /*yield*/, this.fetchProtocolYield(protocol, asset)];
                        case 2: 
                        // Fetch fresh data
                        return [2 /*return*/, _a.sent()];
                        case 3:
                            error_7 = _a.sent();
                            this.logger.error("Failed to get yield for ".concat(protocol, "/").concat(asset, ":"), error_7);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get cache keys matching pattern (helper method)
         */
        YieldScannerService_1.prototype.getCacheKeys = function (pattern) {
            return __awaiter(this, void 0, void 0, function () {
                var store, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            store = this.cacheManager.stores;
                            if (!(store && store.keys)) return [3 /*break*/, 2];
                            return [4 /*yield*/, store.keys(pattern)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [2 /*return*/, []];
                        case 3:
                            error_8 = _a.sent();
                            this.logger.error('Failed to get cache keys:', error_8);
                            return [2 /*return*/, []];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Force refresh yields for all protocols
         */
        YieldScannerService_1.prototype.forceRefresh = function () {
            return __awaiter(this, arguments, void 0, function (asset) {
                var keys;
                var _this = this;
                if (asset === void 0) { asset = 'USDC'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("Force refreshing yields for ".concat(asset));
                            return [4 /*yield*/, this.getCacheKeys("yields:".concat(asset, ":*"))];
                        case 1:
                            keys = _a.sent();
                            return [4 /*yield*/, Promise.all(keys.map(function (key) { return _this.cacheManager.del(key); }))];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.scanAllProtocols(asset)];
                        case 3: 
                        // Fetch fresh data
                        return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * Get yield history for analytics
         */
        YieldScannerService_1.prototype.getYieldHistory = function (protocol_1, asset_1) {
            return __awaiter(this, arguments, void 0, function (protocol, asset, days) {
                var cutoffDate, protocolRecord;
                if (days === void 0) { days = 7; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
                            return [4 /*yield*/, this.prisma.client.protocol.findUnique({
                                    where: { name: protocol },
                                })];
                        case 1:
                            protocolRecord = _a.sent();
                            if (!protocolRecord) {
                                throw new Error("Protocol ".concat(protocol, " not found"));
                            }
                            return [4 /*yield*/, this.prisma.client.yieldSnapshot.findMany({
                                    where: {
                                        protocolId: protocolRecord.id,
                                        asset: asset,
                                        timestamp: { gte: cutoffDate },
                                    },
                                    orderBy: { timestamp: 'asc' },
                                })];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * Health check
         */
        YieldScannerService_1.prototype.healthCheck = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, protocolCount, snapshotCount, latestSnapshot, fiveMinutesAgo, isStale, error_9;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.client.protocol.count({ where: { isActive: true } }),
                                    this.prisma.client.yieldSnapshot.count(),
                                    this.prisma.client.yieldSnapshot.findFirst({
                                        orderBy: { timestamp: 'desc' },
                                        select: { timestamp: true },
                                    }),
                                ])];
                        case 1:
                            _a = _b.sent(), protocolCount = _a[0], snapshotCount = _a[1], latestSnapshot = _a[2];
                            fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
                            isStale = !latestSnapshot || latestSnapshot.timestamp < fiveMinutesAgo;
                            return [2 /*return*/, {
                                    status: isStale ? 'stale' : 'healthy',
                                    activeProtocols: protocolCount,
                                    totalSnapshots: snapshotCount,
                                    lastUpdate: latestSnapshot === null || latestSnapshot === void 0 ? void 0 : latestSnapshot.timestamp,
                                }];
                        case 2:
                            error_9 = _b.sent();
                            this.logger.error('Health check failed:', error_9);
                            return [2 /*return*/, {
                                    status: 'unhealthy',
                                    activeProtocols: 0,
                                    totalSnapshots: 0,
                                    lastUpdate: null,
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return YieldScannerService_1;
    }());
    __setFunctionName(_classThis, "YieldScannerService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _scheduledYieldScan_decorators = [(0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES)];
        __esDecorate(_classThis, null, _scheduledYieldScan_decorators, { kind: "method", name: "scheduledYieldScan", static: false, private: false, access: { has: function (obj) { return "scheduledYieldScan" in obj; }, get: function (obj) { return obj.scheduledYieldScan; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        YieldScannerService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return YieldScannerService = _classThis;
}();
exports.YieldScannerService = YieldScannerService;
