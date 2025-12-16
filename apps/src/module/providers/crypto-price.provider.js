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
exports.CryptoPriceProvider = void 0;
var common_1 = require("@nestjs/common");
var viem_1 = require("viem");
// Chainlink Price Feed ABI (AggregatorV3Interface)
var CHAINLINK_ABI = (0, viem_1.parseAbi)([
    'function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
    'function decimals() external view returns (uint8)',
    'function description() external view returns (string)',
]);
var CryptoPriceProvider = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CryptoPriceProvider = _classThis = /** @class */ (function () {
        function CryptoPriceProvider_1(blockchain, config) {
            this.blockchain = blockchain;
            this.config = config;
            this.logger = new common_1.Logger(CryptoPriceProvider.name);
            // Chainlink Price Feed addresses on Polygon (mainnet)
            this.PRICE_FEEDS = {
                MATIC: '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0', // MATIC/USD
                USDC: '0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7', // USDC/USD
                USDT: '0x0A6513e40db6EB1b165753AD52E80663aeA50545', // USDT/USD
                ETH: '0xF9680D99D6C9589e2a93a78A04A279e509205945', // ETH/USD
                BTC: '0xc907E116054Ad103354f2D350FD2514433D57F6f0', // BTC/USD
            };
        }
        /**
         * Get price for a specific crypto from Chainlink
         */
        CryptoPriceProvider_1.prototype.getPriceFromChainlink = function (symbol) {
            return __awaiter(this, void 0, void 0, function () {
                var feedAddress, roundData, decimals, price, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            feedAddress = this.PRICE_FEEDS[symbol.toUpperCase()];
                            if (!feedAddress) {
                                throw new Error("No Chainlink price feed found for ".concat(symbol));
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, this.blockchain.readContract({
                                    address: feedAddress,
                                    abi: CHAINLINK_ABI,
                                    functionName: 'latestRoundData',
                                })];
                        case 2:
                            roundData = _a.sent();
                            return [4 /*yield*/, this.blockchain.readContract({
                                    address: feedAddress,
                                    abi: CHAINLINK_ABI,
                                    functionName: 'decimals',
                                })];
                        case 3:
                            decimals = _a.sent();
                            price = Number(roundData.answer) / Math.pow(10, decimals);
                            this.logger.debug("Chainlink ".concat(symbol, " price: $").concat(price.toFixed(4)));
                            return [2 /*return*/, {
                                    symbol: symbol.toUpperCase(),
                                    price: price,
                                    decimals: decimals,
                                    updatedAt: new Date(Number(roundData.updatedAt) * 1000),
                                    source: 'chainlink',
                                }];
                        case 4:
                            error_1 = _a.sent();
                            this.logger.error("Failed to fetch Chainlink price for ".concat(symbol, ":"), error_1);
                            throw error_1;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get price for a specific crypto (fallback to CoinGecko if Chainlink fails)
         */
        CryptoPriceProvider_1.prototype.getPrice = function (symbol) {
            return __awaiter(this, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 4]);
                            return [4 /*yield*/, this.getPriceFromChainlink(symbol)];
                        case 1: 
                        // Try Chainlink first
                        return [2 /*return*/, _a.sent()];
                        case 2:
                            error_2 = _a.sent();
                            this.logger.warn("Chainlink failed for ".concat(symbol, ", falling back to CoinGecko"));
                            return [4 /*yield*/, this.getPriceFromCoinGecko(symbol)];
                        case 3: return [2 /*return*/, _a.sent()];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get price from CoinGecko API (fallback)
         */
        CryptoPriceProvider_1.prototype.getPriceFromCoinGecko = function (symbol) {
            return __awaiter(this, void 0, void 0, function () {
                var coinId, response, data, price, error_3;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            coinId = this.getCoinGeckoId(symbol);
                            return [4 /*yield*/, fetch("https://api.coingecko.com/api/v3/simple/price?ids=".concat(coinId, "&vs_currencies=usd"))];
                        case 1:
                            response = _b.sent();
                            if (!response.ok) {
                                throw new Error("CoinGecko API error: ".concat(response.status));
                            }
                            return [4 /*yield*/, response.json()];
                        case 2:
                            data = _b.sent();
                            price = (_a = data[coinId]) === null || _a === void 0 ? void 0 : _a.usd;
                            if (!price) {
                                throw new Error("Price not found for ".concat(symbol, " on CoinGecko"));
                            }
                            this.logger.debug("CoinGecko ".concat(symbol, " price: $").concat(price.toFixed(4)));
                            return [2 /*return*/, {
                                    symbol: symbol.toUpperCase(),
                                    price: price,
                                    decimals: 2, // CoinGecko prices are typically to 2 decimals
                                    updatedAt: new Date(),
                                    source: 'coingecko',
                                }];
                        case 3:
                            error_3 = _b.sent();
                            this.logger.error("Failed to fetch CoinGecko price for ".concat(symbol, ":"), error_3);
                            throw error_3;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get multiple prices at once
         */
        CryptoPriceProvider_1.prototype.getPrices = function (symbols) {
            return __awaiter(this, void 0, void 0, function () {
                var results, _i, symbols_1, symbol, _a, _b, error_4;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            results = {};
                            _i = 0, symbols_1 = symbols;
                            _c.label = 1;
                        case 1:
                            if (!(_i < symbols_1.length)) return [3 /*break*/, 6];
                            symbol = symbols_1[_i];
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 4, , 5]);
                            _a = results;
                            _b = symbol.toUpperCase();
                            return [4 /*yield*/, this.getPrice(symbol)];
                        case 3:
                            _a[_b] = _c.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            error_4 = _c.sent();
                            this.logger.error("Failed to get price for ".concat(symbol, ":"), error_4);
                            return [3 /*break*/, 5];
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6: return [2 /*return*/, results];
                    }
                });
            });
        };
        /**
         * Map symbol to CoinGecko ID
         */
        CryptoPriceProvider_1.prototype.getCoinGeckoId = function (symbol) {
            var mapping = {
                MATIC: 'matic-network',
                USDC: 'usd-coin',
                USDT: 'tether',
                ETH: 'ethereum',
                BTC: 'bitcoin',
            };
            var coinId = mapping[symbol.toUpperCase()];
            if (!coinId) {
                throw new Error("Unknown CoinGecko ID for ".concat(symbol));
            }
            return coinId;
        };
        /**
         * Health check for price feeds
         */
        CryptoPriceProvider_1.prototype.healthCheck = function () {
            return __awaiter(this, void 0, void 0, function () {
                var results, maticPrice, error_5, ethPrice, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            results = {
                                chainlink: false,
                                coingecko: false,
                                lastPrices: {},
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.getPriceFromChainlink('MATIC')];
                        case 2:
                            maticPrice = _a.sent();
                            results.chainlink = true;
                            results.lastPrices.MATIC = maticPrice.price;
                            return [3 /*break*/, 4];
                        case 3:
                            error_5 = _a.sent();
                            this.logger.warn('Chainlink health check failed');
                            return [3 /*break*/, 4];
                        case 4:
                            _a.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, this.getPriceFromCoinGecko('ETH')];
                        case 5:
                            ethPrice = _a.sent();
                            results.coingecko = true;
                            results.lastPrices.ETH = ethPrice.price;
                            return [3 /*break*/, 7];
                        case 6:
                            error_6 = _a.sent();
                            this.logger.warn('CoinGecko health check failed');
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/, results];
                    }
                });
            });
        };
        return CryptoPriceProvider_1;
    }());
    __setFunctionName(_classThis, "CryptoPriceProvider");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CryptoPriceProvider = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CryptoPriceProvider = _classThis;
}();
exports.CryptoPriceProvider = CryptoPriceProvider;
