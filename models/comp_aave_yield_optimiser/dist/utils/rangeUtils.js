import { max, min } from "./mathUtils.js";
const MIN_UINT256 = -1n * 2n ** 255n;
const MAX_UINT256 = 2n ** 256n - 1n;
const RAY = 10n ** 27n;
export const deriveRanges = (a, c) => {
    let lower = min(a, c);
    let higher = max(a, c);
    let rang1 = [MIN_UINT256, lower];
    let range2 = [lower, higher];
    let range3 = [higher, MAX_UINT256];
    return [rang1, range2, range3];
};
export const isOutsideRange = (a, range) => {
    return a < range[0] || a > range[1];
};
export const innerBoundary = (superBoundary, comparison) => {
    let lowerBounadry = max(superBoundary[0], comparison[0]);
    let higherBounadry = max(min(superBoundary[1], comparison[1]), lowerBounadry);
    return [lowerBounadry, higherBounadry];
};
export const validRange = (range) => {
    return range[1] - range[0] > 0;
};
//# sourceMappingURL=rangeUtils.js.map