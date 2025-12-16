import { max, min } from "./mathUtils.js";

const MIN_UINT256 = -1n * 2n ** 255n;
const MAX_UINT256 = 2n ** 256n - 1n;
const RAY = 10n ** 27n;

export const deriveRanges = (a: bigint, c: bigint): [bigint, bigint][] => {
  let lower = min(a, c);

  let higher = max(a, c);

  let rang1: [bigint, bigint] = [MIN_UINT256, lower];
  let range2: [bigint, bigint] = [lower, higher];

  let range3: [bigint, bigint] = [higher, MAX_UINT256];

  return [rang1, range2, range3];
};

export const isOutsideRange = (a: bigint, range: [bigint, bigint]): boolean => {
  return a < range[0] || a > range[1];
};
export const innerBoundary = (
  superBoundary: [bigint, bigint],
  comparison: [bigint, bigint]
): [bigint, bigint] => {
  let lowerBounadry = max(superBoundary[0], comparison[0]);

  let higherBounadry = max(min(superBoundary[1], comparison[1]), lowerBounadry);

  return [lowerBounadry, higherBounadry];
};

export const validRange = (range: [bigint, bigint]): boolean => {
  return range[1] - range[0] > 0;
};
