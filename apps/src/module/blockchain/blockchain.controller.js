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
exports.BlockchainController = void 0;
var common_1 = require("@nestjs/common");
var viem_1 = require("viem");
var BlockchainController = function () {
    var _classDecorators = [(0, common_1.Controller)('blockchain')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getInfo_decorators;
    var _getHealth_decorators;
    var _getGasPrice_decorators;
    var _getTransaction_decorators;
    var _getTokenBalance_decorators;
    var _getTokenPrice_decorators;
    var _checkContract_decorators;
    var BlockchainController = _classThis = /** @class */ (function () {
        function BlockchainController_1(blockchain) {
            this.blockchain = (__runInitializers(this, _instanceExtraInitializers), blockchain);
        }
        /**
         * GET /blockchain/info
         * Get blockchain connection info
         */
        BlockchainController_1.prototype.getInfo = function () {
            return __awaiter(this, void 0, void 0, function () {
                var chain, operatorAddress, _a, blockNumber, gasPrice, operatorBalance;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            chain = this.blockchain.getChain();
                            operatorAddress = this.blockchain.getOperatorAddress();
                            return [4 /*yield*/, Promise.all([
                                    this.blockchain.getCurrentBlockNumber(),
                                    this.blockchain.getGasPrice(),
                                    this.blockchain.getBalance(operatorAddress),
                                ])];
                        case 1:
                            _a = _b.sent(), blockNumber = _a[0], gasPrice = _a[1], operatorBalance = _a[2];
                            return [2 /*return*/, {
                                    success: true,
                                    chain: {
                                        name: chain.name,
                                        id: chain.id,
                                        nativeCurrency: chain.nativeCurrency,
                                    },
                                    operator: {
                                        address: operatorAddress,
                                        balance: (0, viem_1.formatUnits)(operatorBalance, 18),
                                        balanceUnit: 'MATIC',
                                    },
                                    network: {
                                        blockNumber: blockNumber.toString(),
                                        gasPrice: "".concat(Number(gasPrice) / 1e9, " gwei"),
                                    },
                                }];
                    }
                });
            });
        };
        /**
         * GET /blockchain/health
         * Blockchain health check
         */
        BlockchainController_1.prototype.getHealth = function () {
            return __awaiter(this, void 0, void 0, function () {
                var health;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.blockchain.healthCheck()];
                        case 1:
                            health = _a.sent();
                            return [2 /*return*/, __assign(__assign({ success: health.connected }, health), { blockNumber: health.blockNumber.toString(), gasPrice: "".concat(Number(health.gasPrice) / 1e9, " gwei"), operatorBalance: (0, viem_1.formatUnits)(health.operatorBalance, 18), operatorBalanceUSD: "$".concat(health.operatorBalanceUSD.toFixed(2)) })];
                    }
                });
            });
        };
        /**
         * GET /blockchain/gas-price
         * Get current gas price
         */
        BlockchainController_1.prototype.getGasPrice = function () {
            return __awaiter(this, void 0, void 0, function () {
                var gasPrice, isAcceptable;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.blockchain.getGasPrice()];
                        case 1:
                            gasPrice = _a.sent();
                            return [4 /*yield*/, this.blockchain.isGasPriceAcceptable()];
                        case 2:
                            isAcceptable = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    gasPrice: Number(gasPrice),
                                    gasPriceGwei: Number(gasPrice) / 1e9,
                                    isAcceptable: isAcceptable,
                                }];
                    }
                });
            });
        };
        /**
         * GET /blockchain/transaction/:hash
         * Get transaction details
         */
        BlockchainController_1.prototype.getTransaction = function (hash) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, tx, receipt, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, Promise.all([
                                    this.blockchain.getTransaction(hash),
                                    this.blockchain.getTransactionReceipt(hash).catch(function () { return null; }),
                                ])];
                        case 1:
                            _a = _b.sent(), tx = _a[0], receipt = _a[1];
                            return [2 /*return*/, {
                                    success: true,
                                    transaction: tx,
                                    receipt: receipt,
                                }];
                        case 2:
                            error_1 = _b.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    error: error_1.message,
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * GET /blockchain/token/:address/balance
         * Get token balance for operator
         */
        BlockchainController_1.prototype.getTokenBalance = function (address, holder) {
            return __awaiter(this, void 0, void 0, function () {
                var holderAddress, _a, balance, decimals, symbol, error_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            holderAddress = (holder || this.blockchain.getOperatorAddress());
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Promise.all([
                                    this.blockchain.getTokenBalance(address, holderAddress),
                                    this.blockchain.getTokenDecimals(address),
                                    this.blockchain.getTokenSymbol(address),
                                ])];
                        case 2:
                            _a = _b.sent(), balance = _a[0], decimals = _a[1], symbol = _a[2];
                            return [2 /*return*/, {
                                    success: true,
                                    token: {
                                        address: address,
                                        symbol: symbol,
                                        decimals: decimals,
                                    },
                                    holder: holderAddress,
                                    balance: balance.toString(),
                                    balanceFormatted: (0, viem_1.formatUnits)(balance, decimals),
                                }];
                        case 3:
                            error_2 = _b.sent();
                            return [2 /*return*/, {
                                    success: false,
                                    error: error_2.message,
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * GET /blockchain/price/:symbol
         * Get token price in USD
         */
        BlockchainController_1.prototype.getTokenPrice = function (symbol) {
            return __awaiter(this, void 0, void 0, function () {
                var price;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.blockchain.getTokenPrice(symbol)];
                        case 1:
                            price = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    symbol: symbol.toUpperCase(),
                                    priceUSD: price,
                                }];
                    }
                });
            });
        };
        /**
         * GET /blockchain/contract/:address/check
         * Check if contract is deployed
         */
        BlockchainController_1.prototype.checkContract = function (address) {
            return __awaiter(this, void 0, void 0, function () {
                var isDeployed;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.blockchain.isContractDeployed(address)];
                        case 1:
                            isDeployed = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    address: address,
                                    isDeployed: isDeployed,
                                }];
                    }
                });
            });
        };
        return BlockchainController_1;
    }());
    __setFunctionName(_classThis, "BlockchainController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getInfo_decorators = [(0, common_1.Get)('info')];
        _getHealth_decorators = [(0, common_1.Get)('health')];
        _getGasPrice_decorators = [(0, common_1.Get)('gas-price')];
        _getTransaction_decorators = [(0, common_1.Get)('transaction/:hash')];
        _getTokenBalance_decorators = [(0, common_1.Get)('token/:address/balance')];
        _getTokenPrice_decorators = [(0, common_1.Get)('price/:symbol')];
        _checkContract_decorators = [(0, common_1.Get)('contract/:address/check')];
        __esDecorate(_classThis, null, _getInfo_decorators, { kind: "method", name: "getInfo", static: false, private: false, access: { has: function (obj) { return "getInfo" in obj; }, get: function (obj) { return obj.getInfo; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getHealth_decorators, { kind: "method", name: "getHealth", static: false, private: false, access: { has: function (obj) { return "getHealth" in obj; }, get: function (obj) { return obj.getHealth; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getGasPrice_decorators, { kind: "method", name: "getGasPrice", static: false, private: false, access: { has: function (obj) { return "getGasPrice" in obj; }, get: function (obj) { return obj.getGasPrice; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTransaction_decorators, { kind: "method", name: "getTransaction", static: false, private: false, access: { has: function (obj) { return "getTransaction" in obj; }, get: function (obj) { return obj.getTransaction; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTokenBalance_decorators, { kind: "method", name: "getTokenBalance", static: false, private: false, access: { has: function (obj) { return "getTokenBalance" in obj; }, get: function (obj) { return obj.getTokenBalance; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTokenPrice_decorators, { kind: "method", name: "getTokenPrice", static: false, private: false, access: { has: function (obj) { return "getTokenPrice" in obj; }, get: function (obj) { return obj.getTokenPrice; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _checkContract_decorators, { kind: "method", name: "checkContract", static: false, private: false, access: { has: function (obj) { return "checkContract" in obj; }, get: function (obj) { return obj.checkContract; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BlockchainController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BlockchainController = _classThis;
}();
exports.BlockchainController = BlockchainController;
