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
exports.GasCalculatorService = void 0;
var common_1 = require("@nestjs/common");
var GasCalculatorService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var GasCalculatorService = _classThis = /** @class */ (function () {
        function GasCalculatorService_1(config, blockchain) {
            this.config = config;
            this.blockchain = blockchain;
            this.logger = new common_1.Logger(GasCalculatorService.name);
            this.GAS_ESTIMATES = {
                WITHDRAW: 150000n,
                DEPOSIT: 15000n,
                APPROVE: 50000n
            };
        }
        /**
         * Estimate the gas cost for a rebalance operation
         */
        GasCalculatorService_1.prototype.estimateRebalanceGasCost = function (fromProtocol, toProtocol, amount) {
            return __awaiter(this, void 0, void 0, function () {
                var gasPrice, gasPriceGwei, totalGas, gasBuffer, bufferedGas, gasCostWei, gasCostMATIC, maticPriceUSD, gasCostUSD, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            gasPrice = this.blockchain.getGasPrice();
                            gasPriceGwei = Number(gasPrice) / 1e9;
                            totalGas = this.GAS_ESTIMATES.WITHDRAW + this.GAS_ESTIMATES.DEPOSIT + this.GAS_ESTIMATES.APPROVE;
                            gasBuffer = this.config.get("blockchain.gasBuffer", 1.5);
                            bufferedGas = BigInt(Math.floor(Number(totalGas) * gasBuffer));
                            gasCostWei = bufferedGas * gasPrice;
                            gasCostMATIC = (Number(gasPriceGwei) * Number(totalGas)) / 1e18;
                            return [4 /*yield*/, this.blockchain.getMaticPriceUSD()];
                        case 1:
                            maticPriceUSD = _a.sent();
                            gasCostUSD = gasCostMATIC * maticPriceUSD;
                            //log to the console the current price 
                            this.logger.debug("Gas estimates:".concat(bufferedGas, " units @ ").concat(gasPriceGwei.toFixed(2), " gwei= $").concat(gasCostUSD.toFixed(4)));
                            return [2 /*return*/, {
                                    gasUnit: bufferedGas,
                                    gasPriceGwei: gasPriceGwei,
                                    gasCostMATIC: gasCostMATIC,
                                    gasCostUSD: gasCostUSD,
                                    breakDown: {
                                        withDraw: this.GAS_ESTIMATES.WITHDRAW,
                                        deposit: this.GAS_ESTIMATES.DEPOSIT,
                                        approve: this.GAS_ESTIMATES.APPROVE
                                    }
                                }];
                        case 2:
                            err_1 = _a.sent();
                            this.logger.error("Failed to estimate gas cost", err_1);
                            return [2 /*return*/, {
                                    gasUnit: 400000n,
                                    gasPriceGwei: 50,
                                    gasCostMATIC: 0.02,
                                    gasCostUSD: 0.015, // Assume $0.75 MATIC
                                    breakDown: {
                                        withDraw: this.GAS_ESTIMATES.WITHDRAW,
                                        deposit: this.GAS_ESTIMATES.DEPOSIT,
                                        approve: this.GAS_ESTIMATES.APPROVE,
                                    },
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**Estimate gas fee for specific vault contract call */
        GasCalculatorService_1.prototype.estimateVaultRebalance = function (vaultAddress, targetStrategy, abi) {
            return __awaiter(this, void 0, void 0, function () {
                var estimate, maticPriceUSD, gasCostMATIC, gasCostUSD, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.blockchain.estimateGas({
                                    address: vaultAddress,
                                    abi: abi,
                                    functionName: "rebalance",
                                    args: [targetStrategy]
                                })];
                        case 1:
                            estimate = _a.sent();
                            return [4 /*yield*/, this.getMaticPrice()];
                        case 2:
                            maticPriceUSD = _a.sent();
                            gasCostMATIC = Number(estimate.totalCost) / 1e18;
                            gasCostUSD = gasCostMATIC * maticPriceUSD;
                            return [2 /*return*/, {
                                    gasUnit: estimate.gas,
                                    gasPriceGwei: Number(estimate.gasPrice) / 1e9,
                                    gasCostMATIC: gasCostMATIC,
                                    gasCostUSD: gasCostUSD,
                                    breakDown: {
                                        withDraw: 0n,
                                        approve: 0n, deposit: 0n
                                    }
                                }];
                        case 3:
                            error_1 = _a.sent();
                            this.logger.error("Failed to estimate value rebalance gas:", error_1);
                            throw error_1;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get Current Matic price in Usd
         */
        GasCalculatorService_1.prototype.getMaticPrice = function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, data, error_2;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd')];
                        case 1:
                            response = _b.sent();
                            return [4 /*yield*/, response.json()];
                        case 2:
                            data = _b.sent();
                            return [2 /*return*/, ((_a = data['matic-network']) === null || _a === void 0 ? void 0 : _a.usd) || 0.75]; // Fallback to $0.75
                        case 3:
                            error_2 = _b.sent();
                            this.logger.warn('Failed to fetch MATIC price, using fallback');
                            return [2 /*return*/, 0.75]; // Conservative fallback
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Check if the gas price is within the acceptable range
         */
        GasCalculatorService_1.prototype.isGasPriceAcceptable = function () {
            return __awaiter(this, void 0, void 0, function () {
                var gasPrice, gasPriceGwei, minGasPrice, maxGasPrice, acceptable;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.blockchain.getGasPrice()];
                        case 1:
                            gasPrice = _a.sent();
                            gasPriceGwei = Number(gasPrice) / 1e9;
                            minGasPrice = this.config.get('blockchain.minGasPrice', 30);
                            maxGasPrice = this.config.get('blockchain.maxGasPrice', 500);
                            acceptable = gasPriceGwei >= minGasPrice && gasPriceGwei <= maxGasPrice;
                            if (!acceptable) {
                                this.logger.warn("Gas price ".concat(gasPriceGwei, " gwei is outside acceptable range [").concat(minGasPrice, ", ").concat(maxGasPrice, "]"));
                            }
                            return [2 /*return*/, acceptable];
                    }
                });
            });
        };
        return GasCalculatorService_1;
    }());
    __setFunctionName(_classThis, "GasCalculatorService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GasCalculatorService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GasCalculatorService = _classThis;
}();
exports.GasCalculatorService = GasCalculatorService;
