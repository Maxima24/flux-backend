const MAX_UINT256 = 2n ** 256n - 1n;
const RAY = 10n ** 27n;
const WAD = 10n ** 18n;
const PERCENTAGE_FACTOR = 10000n;
const HALF_PERCENTAGE_FACTOR = 5000n;
export function rayMul(x, y) {
    return (x * y) / RAY;
}
export function wadMul(x, y) {
    return (x * y) / WAD;
}
export function wadDiv(x, y) {
    return (x * WAD) / y;
}
export function rayDiv(x, y) {
    return (x * RAY) / y;
}
export function percentMul(value, percentage) {
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
export function factorMul(x, y, factor) {
    return (x * y) / factor;
}
export function factorDiv(x, y, factor) {
    return (x * factor) / y;
}
export function min(x, y) {
    return x < y ? x : y;
}
export function max(x, y) {
    return x > y ? x : y;
}
//# sourceMappingURL=mathUtils.js.map