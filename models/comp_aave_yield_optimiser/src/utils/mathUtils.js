"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rayMul = rayMul;
exports.wadMul = wadMul;
exports.wadDiv = wadDiv;
exports.rayDiv = rayDiv;
exports.percentMul = percentMul;
exports.factorMul = factorMul;
exports.factorDiv = factorDiv;
exports.min = min;
exports.max = max;
var MAX_UINT256 = Math.pow(2n, 256n) - 1n;
var RAY = Math.pow(10n, 27n);
var WAD = Math.pow(10n, 18n);
var PERCENTAGE_FACTOR = 10000n;
var HALF_PERCENTAGE_FACTOR = 5000n;
function rayMul(x, y) {
    return (x * y) / RAY;
}
function wadMul(x, y) {
    return (x * y) / WAD;
}
function wadDiv(x, y) {
    return (x * WAD) / y;
}
function rayDiv(x, y) {
    return (x * RAY) / y;
}
function percentMul(value, percentage) {
    // 1. Handle edge cases to match Solidity assembly `iszero` checks
    if (value === 0n || percentage === 0n) {
        return 0n;
    }
    // 2. Strict Overflow Check (Optional in pure TS, but required for 1:1 parity)
    // Solidity: to avoid overflow, value <= (type(uint256).max - HALF_PERCENTAGE_FACTOR) / percentage
    // If we want to strictly mimic the revert:
    if (value > (MAX_UINT256 - HALF_PERCENTAGE_FACTOR) / percentage) {
        throw new Error("percentMul: arithmetic overflow");
    }
    // 3. The Calculation
    // Formula: (value * percentage + HALF_PERCENTAGE_FACTOR) / PERCENTAGE_FACTOR
    // The addition of HALF_PERCENTAGE_FACTOR ensures we round to the nearest integer
    return (value * percentage + HALF_PERCENTAGE_FACTOR) / PERCENTAGE_FACTOR;
}
function factorMul(x, y, factor) {
    return (x * y) / factor;
}
function factorDiv(x, y, factor) {
    return (x * factor) / y;
}
function min(x, y) {
    return x < y ? x : y;
}
function max(x, y) {
    return x > y ? x : y;
}
