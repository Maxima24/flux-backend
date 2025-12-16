"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplyToCompound = supplyToCompound;
exports.withdrawFromCompound = withdrawFromCompound;
exports.getDetailsCompound = getDetailsCompound;
var ethers_1 = require("ethers");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
//@ts-ignore
var abi_json_1 = require("./abi.json");
var provider = new ethers_1.ethers.JsonRpcProvider("https://polygon-mainnet.infura.io/v3/3a0bf1b6f69c4750b475bb4aa42d9dca");
var tokenABI = ['function balanceOf(address account) external view returns (uint256)'];
// export async function queryBalanceComp(assetMetaData: AssetMetaData,account: string): Promise<bigint> {
//     const token = new ethers.Contract(
//         assetMetaData.compPoolAddress,
//         tokenABI,
//         provider
//       );
//     //@ts-ignore
//     let balance: bigint = await token.balanceOf(account);
//     return balance;
//   }
function supplyToCompound(assetMetaData, amount, pkey) {
    return __awaiter(this, void 0, void 0, function () {
        var signer, pool, tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    signer = (new ethers_1.Wallet(pkey, provider));
                    pool = new ethers_1.Contract(assetMetaData.compPoolAddress, abi_json_1.default, signer);
                    return [4 /*yield*/, pool.supply(assetMetaData.assetAddress, amount)];
                case 1:
                    tx = _a.sent();
                    return [2 /*return*/, tx];
            }
        });
    });
}
function withdrawFromCompound(assetMetaData, amount, pkey) {
    return __awaiter(this, void 0, void 0, function () {
        var compPoolAddress, assetAddress, signer, pool, tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    compPoolAddress = assetMetaData.compPoolAddress, assetAddress = assetMetaData.assetAddress;
                    signer = new ethers_1.Wallet(pkey, provider);
                    pool = new ethers_1.Contract(assetMetaData.compPoolAddress, abi_json_1.default, signer);
                    return [4 /*yield*/, pool.withdraw(assetAddress, amount)];
                case 1:
                    tx = _a.sent();
                    return [2 /*return*/, tx];
            }
        });
    });
}
function getDetailsCompound(assetMetaData) {
    return __awaiter(this, void 0, void 0, function () {
        var compPoolAddress, assetAddress, decimals, pool, token, promises, _a, availableLiquidity, totalBorrow, totalSupply, supplyKink, supplyPerSecondInterestRateBase, supplyPerSecondInterestRateSlopeLow, supplyPerSecondInterestRateSlopeHigh, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    compPoolAddress = assetMetaData.compPoolAddress, assetAddress = assetMetaData.assetAddress, decimals = assetMetaData.decimals;
                    pool = new ethers_1.Contract(compPoolAddress, abi_json_1.default, provider);
                    token = new ethers_1.Contract(assetAddress, tokenABI, provider);
                    promises = [
                        //@ts-ignore
                        token.balanceOf(compPoolAddress),
                        //@ts-ignore
                        pool.totalBorrow(),
                        //@ts-ignore
                        pool.totalSupply(),
                        //@ts-ignore
                        pool.supplyKink(),
                        //@ts-ignore
                        pool.supplyPerSecondInterestRateBase(),
                        //@ts-ignore
                        pool.supplyPerSecondInterestRateSlopeLow(),
                        //@ts-ignore
                        pool.supplyPerSecondInterestRateSlopeHigh(),
                    ];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.all(promises)];
                case 2:
                    _a = (_b.sent()), availableLiquidity = _a[0], totalBorrow = _a[1], totalSupply = _a[2], supplyKink = _a[3], supplyPerSecondInterestRateBase = _a[4], supplyPerSecondInterestRateSlopeLow = _a[5], supplyPerSecondInterestRateSlopeHigh = _a[6];
                    return [2 /*return*/, {
                            decimals: decimals,
                            totalBorrow: totalBorrow,
                            totalSupply: totalSupply,
                            availableLiquidity: availableLiquidity,
                            supplyKink: supplyKink,
                            supplyPerSecondInterestRateBase: supplyPerSecondInterestRateBase,
                            supplyPerSecondInterestRateSlopeHigh: supplyPerSecondInterestRateSlopeHigh,
                            supplyPerSecondInterestRateSlopeLow: supplyPerSecondInterestRateSlopeLow,
                        }];
                case 3:
                    err_1 = _b.sent();
                    throw new Error("Failed to fetch Compound details: ".concat(err_1));
                case 4: return [2 /*return*/];
            }
        });
    });
}
