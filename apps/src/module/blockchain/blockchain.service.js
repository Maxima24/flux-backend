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
exports.BlockchainService = void 0;
var common_1 = require("@nestjs/common");
var viem_1 = require("viem");
var accounts_1 = require("viem/accounts");
var BlockchainService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var BlockchainService = _classThis = /** @class */ (function () {
        function BlockchainService_1(config) {
            this.config = config;
            this.logger = new common_1.Logger(BlockchainService.name);
        }
        BlockchainService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                var privateKey, blockNumber, balance, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.chain = this.config.get('blockchain.chain');
                            this.rpcUrl = this.config.get('blockchain.rpcUrl');
                            privateKey = this.config.get('blockchain.operatorPrivateKey');
                            if (!privateKey) {
                                this.logger.error('OPERATOR_PRIVATE_KEY not configured!');
                                throw new Error('OPERATOR_PRIVATE_KEY is required');
                            }
                            if (!this.rpcUrl) {
                                this.logger.error('RPC_URL not configured!');
                                throw new Error('RPC_URL is required');
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            // Initialize operator account
                            this.operatorAccount = (0, accounts_1.privateKeyToAccount)(privateKey);
                            // Public client (for reading blockchain data)
                            this.publicClient = (0, viem_1.createPublicClient)({
                                chain: this.chain,
                                transport: (0, viem_1.http)(this.rpcUrl),
                            });
                            // Wallet client (for writing transactions)
                            this.walletClient = (0, viem_1.createWalletClient)({
                                account: this.operatorAccount,
                                chain: this.chain,
                                transport: (0, viem_1.http)(this.rpcUrl),
                            });
                            return [4 /*yield*/, this.publicClient.getBlockNumber()];
                        case 2:
                            blockNumber = _a.sent();
                            return [4 /*yield*/, this.getBalance(this.operatorAccount.address)];
                        case 3:
                            balance = _a.sent();
                            this.logger.log('✅ Blockchain service initialized');
                            this.logger.log("Chain: ".concat(this.chain.name, " (ID: ").concat(this.chain.id, ")"));
                            this.logger.log("Operator: ".concat(this.operatorAccount.address));
                            this.logger.log("Block: ".concat(blockNumber));
                            this.logger.log("Balance: ".concat((0, viem_1.formatUnits)(balance, 18), " MATIC"));
                            // Warn if balance is low
                            if (balance < (0, viem_1.parseUnits)('0.1', 18)) {
                                this.logger.warn('⚠️  Operator balance is low! Please top up.');
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            this.logger.error('Failed to initialize blockchain service:', error_1);
                            throw error_1;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================================
        // GETTERS
        // ============================================
        BlockchainService_1.prototype.getPublicClient = function () {
            return this.publicClient;
        };
        BlockchainService_1.prototype.getWalletClient = function () {
            return this.walletClient;
        };
        BlockchainService_1.prototype.getOperatorAddress = function () {
            return this.operatorAccount.address;
        };
        BlockchainService_1.prototype.getChain = function () {
            return this.chain;
        };
        // ============================================
        // BLOCKCHAIN INFO
        // ============================================
        BlockchainService_1.prototype.getBalance = function (address) {
            return __awaiter(this, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.publicClient.getBalance({ address: address })];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_2 = _a.sent();
                            this.logger.error("Failed to get balance for ".concat(address, ":"), error_2);
                            throw error_2;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        BlockchainService_1.prototype.getCurrentBlockNumber = function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.publicClient.getBlockNumber()];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_3 = _a.sent();
                            this.logger.error('Failed to get block number:', error_3);
                            throw error_3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        BlockchainService_1.prototype.getGasPrice = function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.publicClient.getGasPrice()];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_4 = _a.sent();
                            this.logger.error('Failed to get gas price:', error_4);
                            throw error_4;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        BlockchainService_1.prototype.getTransaction = function (hash) {
            return __awaiter(this, void 0, void 0, function () {
                var error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.publicClient.getTransaction({ hash: hash })];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_5 = _a.sent();
                            this.logger.error("Failed to get transaction ".concat(hash, ":"), error_5);
                            throw error_5;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        BlockchainService_1.prototype.getTransactionReceipt = function (hash) {
            return __awaiter(this, void 0, void 0, function () {
                var error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.publicClient.getTransactionReceipt({ hash: hash })];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_6 = _a.sent();
                            this.logger.error("Failed to get receipt for ".concat(hash, ":"), error_6);
                            throw error_6;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================================
        // CONTRACT READING
        // ============================================
        BlockchainService_1.prototype.readContract = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.publicClient.readContract({
                                    address: params.address,
                                    abi: params.abi,
                                    functionName: params.functionName,
                                    args: params.args || [],
                                })];
                        case 1:
                            result = _a.sent();
                            this.logger.debug("Read ".concat(params.address, ".").concat(params.functionName, "() = ").concat(JSON.stringify(result)));
                            return [2 /*return*/, result];
                        case 2:
                            error_7 = _a.sent();
                            this.logger.error("Failed to read ".concat(params.address, ".").concat(params.functionName, "():"), error_7);
                            throw error_7;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        BlockchainService_1.prototype.multicall = function (calls) {
            return __awaiter(this, void 0, void 0, function () {
                var results, error_8;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, Promise.all(calls.map(function (call) { return _this.readContract(call); }))];
                        case 1:
                            results = _a.sent();
                            return [2 /*return*/, results];
                        case 2:
                            error_8 = _a.sent();
                            this.logger.error('Multicall failed:', error_8);
                            throw error_8;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================================
        // CONTRACT WRITING
        // ============================================
        BlockchainService_1.prototype.writeContract = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var request, hash, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            this.logger.log("Writing ".concat(params.address, ".").concat(params.functionName, "(").concat(JSON.stringify(params.args || []), ")"));
                            return [4 /*yield*/, this.publicClient.simulateContract({
                                    address: params.address,
                                    abi: params.abi,
                                    functionName: params.functionName,
                                    args: params.args || [],
                                    value: params.value,
                                    account: this.operatorAccount,
                                })];
                        case 1:
                            request = (_a.sent()).request;
                            return [4 /*yield*/, this.walletClient.writeContract(request)];
                        case 2:
                            hash = _a.sent();
                            this.logger.log("Transaction sent: ".concat(hash));
                            return [2 /*return*/, hash];
                        case 3:
                            error_9 = _a.sent();
                            this.logger.error("Failed to write ".concat(params.address, ".").concat(params.functionName, "():"), error_9);
                            throw error_9;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        BlockchainService_1.prototype.writeContractWithConfirmation = function (params_1) {
            return __awaiter(this, arguments, void 0, function (params, confirmations) {
                var hash, receipt, result, error_10;
                if (confirmations === void 0) { confirmations = 2; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.writeContract(params)];
                        case 1:
                            hash = _a.sent();
                            this.logger.log("Waiting for ".concat(confirmations, " confirmations..."));
                            return [4 /*yield*/, this.waitForTransaction(hash, confirmations)];
                        case 2:
                            receipt = _a.sent();
                            result = {
                                hash: hash,
                                status: receipt.status === 'success' ? 'success' : 'failed',
                                gasUsed: receipt.gasUsed,
                                blockNumber: receipt.blockNumber,
                                receipt: receipt,
                            };
                            if (result.status === 'success') {
                                this.logger.log("\u2705 Transaction confirmed: ".concat(hash));
                            }
                            else {
                                this.logger.error("\u274C Transaction failed: ".concat(hash));
                            }
                            return [2 /*return*/, result];
                        case 3:
                            error_10 = _a.sent();
                            this.logger.error('Transaction failed:', error_10);
                            return [2 /*return*/, {
                                    hash: '0x',
                                    status: 'failed',
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        BlockchainService_1.prototype.waitForTransaction = function (hash_1) {
            return __awaiter(this, arguments, void 0, function (hash, confirmations) {
                var error_11;
                if (confirmations === void 0) { confirmations = 2; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.publicClient.waitForTransactionReceipt({
                                    hash: hash,
                                    confirmations: confirmations,
                                    timeout: 120000, // 2 minutes
                                })];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_11 = _a.sent();
                            this.logger.error("Failed to wait for transaction ".concat(hash, ":"), error_11);
                            throw error_11;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================================
        // GAS ESTIMATION
        // ============================================
        BlockchainService_1.prototype.estimateGas = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var gas, gasPrice, gasBuffer, bufferedGas, totalCost, maticPriceUSD, totalCostMATIC, totalCostUSD, error_12;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, this.publicClient.estimateContractGas({
                                    address: params.address,
                                    abi: params.abi,
                                    functionName: params.functionName,
                                    args: params.args || [],
                                    value: params.value,
                                    account: this.operatorAccount,
                                })];
                        case 1:
                            gas = _a.sent();
                            return [4 /*yield*/, this.getGasPrice()];
                        case 2:
                            gasPrice = _a.sent();
                            gasBuffer = this.config.get('blockchain.gasBuffer', 1.5);
                            bufferedGas = BigInt(Math.floor(Number(gas) * gasBuffer));
                            totalCost = bufferedGas * gasPrice;
                            return [4 /*yield*/, this.getMaticPrice()];
                        case 3:
                            maticPriceUSD = _a.sent();
                            totalCostMATIC = Number(totalCost) / 1e18;
                            totalCostUSD = totalCostMATIC * maticPriceUSD;
                            this.logger.debug("Gas estimate: ".concat(bufferedGas, " units @ ").concat(Number(gasPrice) / 1e9, " gwei = $").concat(totalCostUSD.toFixed(4)));
                            return [2 /*return*/, {
                                    gas: bufferedGas,
                                    gasPrice: gasPrice,
                                    totalCost: totalCost,
                                    totalCostUSD: totalCostUSD,
                                }];
                        case 4:
                            error_12 = _a.sent();
                            this.logger.error('Gas estimation failed:', error_12);
                            throw error_12;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        BlockchainService_1.prototype.isGasPriceAcceptable = function () {
            return __awaiter(this, void 0, void 0, function () {
                var gasPrice, gasPriceGwei, minGasPrice, maxGasPrice, acceptable, error_13;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.getGasPrice()];
                        case 1:
                            gasPrice = _a.sent();
                            gasPriceGwei = Number(gasPrice) / 1e9;
                            minGasPrice = this.config.get('blockchain.minGasPrice', 30);
                            maxGasPrice = this.config.get('blockchain.maxGasPrice', 500);
                            acceptable = gasPriceGwei >= minGasPrice && gasPriceGwei <= maxGasPrice;
                            if (!acceptable) {
                                this.logger.warn("Gas price ".concat(gasPriceGwei.toFixed(2), " gwei outside acceptable range [").concat(minGasPrice, ", ").concat(maxGasPrice, "]"));
                            }
                            return [2 /*return*/, acceptable];
                        case 2:
                            error_13 = _a.sent();
                            this.logger.error('Failed to check gas price:', error_13);
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================================
        // TOKEN UTILITIES
        // ============================================
        BlockchainService_1.prototype.getTokenBalance = function (tokenAddress, holderAddress) {
            return __awaiter(this, void 0, void 0, function () {
                var ERC20_ABI;
                return __generator(this, function (_a) {
                    ERC20_ABI = [
                        {
                            inputs: [{ name: 'account', type: 'address' }],
                            name: 'balanceOf',
                            outputs: [{ name: '', type: 'uint256' }],
                            stateMutability: 'view',
                            type: 'function',
                        },
                    ];
                    return [2 /*return*/, this.readContract({
                            address: tokenAddress,
                            abi: ERC20_ABI,
                            functionName: 'balanceOf',
                            args: [holderAddress],
                        })];
                });
            });
        };
        BlockchainService_1.prototype.getTokenDecimals = function (tokenAddress) {
            return __awaiter(this, void 0, void 0, function () {
                var ERC20_ABI;
                return __generator(this, function (_a) {
                    ERC20_ABI = [
                        {
                            inputs: [],
                            name: 'decimals',
                            outputs: [{ name: '', type: 'uint8' }],
                            stateMutability: 'view',
                            type: 'function',
                        },
                    ];
                    return [2 /*return*/, this.readContract({
                            address: tokenAddress,
                            abi: ERC20_ABI,
                            functionName: 'decimals',
                        })];
                });
            });
        };
        BlockchainService_1.prototype.getTokenSymbol = function (tokenAddress) {
            return __awaiter(this, void 0, void 0, function () {
                var ERC20_ABI;
                return __generator(this, function (_a) {
                    ERC20_ABI = [
                        {
                            inputs: [],
                            name: 'symbol',
                            outputs: [{ name: '', type: 'string' }],
                            stateMutability: 'view',
                            type: 'function',
                        },
                    ];
                    return [2 /*return*/, this.readContract({
                            address: tokenAddress,
                            abi: ERC20_ABI,
                            functionName: 'symbol',
                        })];
                });
            });
        };
        BlockchainService_1.prototype.approveToken = function (tokenAddress, spenderAddress, amount) {
            return __awaiter(this, void 0, void 0, function () {
                var ERC20_ABI;
                return __generator(this, function (_a) {
                    ERC20_ABI = [
                        {
                            inputs: [
                                { name: 'spender', type: 'address' },
                                { name: 'amount', type: 'uint256' },
                            ],
                            name: 'approve',
                            outputs: [{ name: '', type: 'bool' }],
                            stateMutability: 'nonpayable',
                            type: 'function',
                        },
                    ];
                    return [2 /*return*/, this.writeContract({
                            address: tokenAddress,
                            abi: ERC20_ABI,
                            functionName: 'approve',
                            args: [spenderAddress, amount],
                        })];
                });
            });
        };
        // ============================================
        // FORMATTING UTILITIES
        // ============================================
        BlockchainService_1.prototype.parseUnits = function (value, decimals) {
            return (0, viem_1.parseUnits)(value, decimals);
        };
        BlockchainService_1.prototype.formatUnits = function (value, decimals) {
            return (0, viem_1.formatUnits)(value, decimals);
        };
        // ============================================
        // PRICE FEEDS
        // ============================================
        BlockchainService_1.prototype.getMaticPrice = function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, data, error_14;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd', { signal: AbortSignal.timeout(5000) })];
                        case 1:
                            response = _b.sent();
                            if (!response.ok) {
                                throw new Error("HTTP ".concat(response.status));
                            }
                            return [4 /*yield*/, response.json()];
                        case 2:
                            data = _b.sent();
                            return [2 /*return*/, ((_a = data['matic-network']) === null || _a === void 0 ? void 0 : _a.usd) || 0.75]; // Fallback
                        case 3:
                            error_14 = _b.sent();
                            this.logger.warn('Failed to fetch MATIC price, using fallback:', error_14.message);
                            return [2 /*return*/, 0.75]; // Conservative fallback
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        BlockchainService_1.prototype.getTokenPrice = function (symbol) {
            return __awaiter(this, void 0, void 0, function () {
                var coinGeckoIds, id, response, data, error_15;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            coinGeckoIds = {
                                MATIC: 'matic-network',
                                USDC: 'usd-coin',
                                USDT: 'tether',
                                ETH: 'ethereum',
                                WETH: 'ethereum',
                                WBTC: 'wrapped-bitcoin',
                            };
                            id = coinGeckoIds[symbol.toUpperCase()];
                            if (!id) {
                                this.logger.warn("Unknown token symbol: ".concat(symbol));
                                return [2 /*return*/, 0];
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, fetch("https://api.coingecko.com/api/v3/simple/price?ids=".concat(id, "&vs_currencies=usd"), { signal: AbortSignal.timeout(5000) })];
                        case 2:
                            response = _b.sent();
                            if (!response.ok) {
                                throw new Error("HTTP ".concat(response.status));
                            }
                            return [4 /*yield*/, response.json()];
                        case 3:
                            data = _b.sent();
                            return [2 /*return*/, ((_a = data[id]) === null || _a === void 0 ? void 0 : _a.usd) || 0];
                        case 4:
                            error_15 = _b.sent();
                            this.logger.error("Failed to fetch ".concat(symbol, " price:"), error_15);
                            return [2 /*return*/, 0];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================================
        // HEALTH CHECK
        // ============================================
        BlockchainService_1.prototype.healthCheck = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, blockNumber, gasPrice, operatorBalance, maticPrice, operatorBalanceMATIC, operatorBalanceUSD, error_16;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, Promise.all([
                                    this.getCurrentBlockNumber(),
                                    this.getGasPrice(),
                                    this.getBalance(this.operatorAccount.address),
                                ])];
                        case 1:
                            _a = _b.sent(), blockNumber = _a[0], gasPrice = _a[1], operatorBalance = _a[2];
                            return [4 /*yield*/, this.getMaticPrice()];
                        case 2:
                            maticPrice = _b.sent();
                            operatorBalanceMATIC = Number(operatorBalance) / 1e18;
                            operatorBalanceUSD = operatorBalanceMATIC * maticPrice;
                            return [2 /*return*/, {
                                    connected: true,
                                    blockNumber: blockNumber,
                                    gasPrice: gasPrice,
                                    operatorBalance: operatorBalance,
                                    operatorBalanceUSD: operatorBalanceUSD,
                                }];
                        case 3:
                            error_16 = _b.sent();
                            this.logger.error('Blockchain health check failed:', error_16);
                            return [2 /*return*/, {
                                    connected: false,
                                    blockNumber: 0n,
                                    gasPrice: 0n,
                                    operatorBalance: 0n,
                                    operatorBalanceUSD: 0,
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================================
        // MONITORING
        // ============================================
        BlockchainService_1.prototype.checkOperatorBalance = function () {
            return __awaiter(this, arguments, void 0, function (minBalanceMATIC) {
                var balance, balanceMATIC, error_17;
                if (minBalanceMATIC === void 0) { minBalanceMATIC = 0.1; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.getBalance(this.operatorAccount.address)];
                        case 1:
                            balance = _a.sent();
                            balanceMATIC = Number(balance) / 1e18;
                            if (balanceMATIC < minBalanceMATIC) {
                                this.logger.warn("\u26A0\uFE0F  Operator balance low: ".concat(balanceMATIC.toFixed(4), " MATIC (min: ").concat(minBalanceMATIC, ")"));
                                return [2 /*return*/, false];
                            }
                            return [2 /*return*/, true];
                        case 2:
                            error_17 = _a.sent();
                            this.logger.error('Failed to check operator balance:', error_17);
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        BlockchainService_1.prototype.isContractDeployed = function (address) {
            return __awaiter(this, void 0, void 0, function () {
                var code, error_18;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.publicClient.getBytecode({ address: address })];
                        case 1:
                            code = _a.sent();
                            return [2 /*return*/, code !== undefined && code !== '0x'];
                        case 2:
                            error_18 = _a.sent();
                            this.logger.error("Failed to check contract at ".concat(address, ":"), error_18);
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return BlockchainService_1;
    }());
    __setFunctionName(_classThis, "BlockchainService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BlockchainService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BlockchainService = _classThis;
}();
exports.BlockchainService = BlockchainService;
