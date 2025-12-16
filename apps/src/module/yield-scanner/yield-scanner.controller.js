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
exports.YieldScannerController = void 0;
var common_1 = require("@nestjs/common");
var YieldScannerController = function () {
    var _classDecorators = [(0, common_1.Controller)('yields')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getAllYields_decorators;
    var _getBestYield_decorators;
    var _getProtocolYield_decorators;
    var _forceScan_decorators;
    var _getHistory_decorators;
    var _healthCheck_decorators;
    var YieldScannerController = _classThis = /** @class */ (function () {
        function YieldScannerController_1(yieldScanner) {
            this.yieldScanner = (__runInitializers(this, _instanceExtraInitializers), yieldScanner);
        }
        /**
         * GET /yields?asset=USDC
         * Get all current yields for an asset
         */
        YieldScannerController_1.prototype.getAllYields = function () {
            return __awaiter(this, arguments, void 0, function (asset) {
                var yields;
                if (asset === void 0) { asset = 'USDC'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.yieldScanner.getAllYields(asset)];
                        case 1:
                            yields = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    asset: asset,
                                    count: yields.length,
                                    yields: yields,
                                }];
                    }
                });
            });
        };
        /**
         * GET /yields/best?asset=USDC
         * Get best yield for an asset
         */
        YieldScannerController_1.prototype.getBestYield = function () {
            return __awaiter(this, arguments, void 0, function (asset) {
                var bestYield;
                if (asset === void 0) { asset = 'USDC'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.yieldScanner.getBestYield(asset)];
                        case 1:
                            bestYield = _a.sent();
                            if (!bestYield) {
                                return [2 /*return*/, {
                                        success: false,
                                        message: "No yields available for ".concat(asset),
                                    }];
                            }
                            return [2 /*return*/, {
                                    success: true,
                                    asset: asset,
                                    bestYield: bestYield,
                                }];
                    }
                });
            });
        };
        /**
         * GET /yields/protocol/:protocol?asset=USDC
         * Get yield for specific protocol
         */
        YieldScannerController_1.prototype.getProtocolYield = function (protocol_1) {
            return __awaiter(this, arguments, void 0, function (protocol, asset) {
                var yield_data;
                if (asset === void 0) { asset = 'USDC'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.yieldScanner.getProtocolYield(protocol, asset)];
                        case 1:
                            yield_data = _a.sent();
                            if (!yield_data) {
                                return [2 /*return*/, {
                                        success: false,
                                        message: "No yield data for ".concat(protocol, "/").concat(asset),
                                    }];
                            }
                            return [2 /*return*/, {
                                    success: true,
                                    protocol: protocol,
                                    asset: asset,
                                    yield: yield_data,
                                }];
                    }
                });
            });
        };
        /**
         * POST /yields/scan?asset=USDC
         * Force refresh yields
         */
        YieldScannerController_1.prototype.forceScan = function () {
            return __awaiter(this, arguments, void 0, function (asset) {
                var yields;
                if (asset === void 0) { asset = 'USDC'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.yieldScanner.forceRefresh(asset)];
                        case 1:
                            yields = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    asset: asset,
                                    count: yields.length,
                                    yields: yields,
                                }];
                    }
                });
            });
        };
        /**
         * GET /yields/history/:protocol?asset=USDC&days=7
         * Get historical yield data
         */
        YieldScannerController_1.prototype.getHistory = function (protocol_1) {
            return __awaiter(this, arguments, void 0, function (protocol, asset, days) {
                var history;
                if (asset === void 0) { asset = 'USDC'; }
                if (days === void 0) { days = '7'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.yieldScanner.getYieldHistory(protocol, asset, parseInt(days))];
                        case 1:
                            history = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    protocol: protocol,
                                    asset: asset,
                                    period: "".concat(days, " days"),
                                    count: history.length,
                                    history: history,
                                }];
                    }
                });
            });
        };
        /**
         * GET /yields/health
         * Health check
         */
        YieldScannerController_1.prototype.healthCheck = function () {
            return __awaiter(this, void 0, void 0, function () {
                var health;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.yieldScanner.healthCheck()];
                        case 1:
                            health = _a.sent();
                            return [2 /*return*/, __assign({ success: true }, health)];
                    }
                });
            });
        };
        return YieldScannerController_1;
    }());
    __setFunctionName(_classThis, "YieldScannerController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getAllYields_decorators = [(0, common_1.Get)()];
        _getBestYield_decorators = [(0, common_1.Get)('best')];
        _getProtocolYield_decorators = [(0, common_1.Get)('protocol/:protocol')];
        _forceScan_decorators = [(0, common_1.Post)('scan')];
        _getHistory_decorators = [(0, common_1.Get)('history/:protocol')];
        _healthCheck_decorators = [(0, common_1.Get)('health')];
        __esDecorate(_classThis, null, _getAllYields_decorators, { kind: "method", name: "getAllYields", static: false, private: false, access: { has: function (obj) { return "getAllYields" in obj; }, get: function (obj) { return obj.getAllYields; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBestYield_decorators, { kind: "method", name: "getBestYield", static: false, private: false, access: { has: function (obj) { return "getBestYield" in obj; }, get: function (obj) { return obj.getBestYield; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProtocolYield_decorators, { kind: "method", name: "getProtocolYield", static: false, private: false, access: { has: function (obj) { return "getProtocolYield" in obj; }, get: function (obj) { return obj.getProtocolYield; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _forceScan_decorators, { kind: "method", name: "forceScan", static: false, private: false, access: { has: function (obj) { return "forceScan" in obj; }, get: function (obj) { return obj.forceScan; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getHistory_decorators, { kind: "method", name: "getHistory", static: false, private: false, access: { has: function (obj) { return "getHistory" in obj; }, get: function (obj) { return obj.getHistory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _healthCheck_decorators, { kind: "method", name: "healthCheck", static: false, private: false, access: { has: function (obj) { return "healthCheck" in obj; }, get: function (obj) { return obj.healthCheck; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        YieldScannerController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return YieldScannerController = _classThis;
}();
exports.YieldScannerController = YieldScannerController;
