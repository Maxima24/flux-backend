const RAY = 10n ** 27n;
const WAD = 10n ** 18n;
export function fromray(x: bigint, factor: bigint) {
  return (x * factor) / RAY;
}

export function wadToRay(x: bigint) {
  return toRay(x, 10n ** 18n);
}

export function rayTowad(x: bigint): bigint {
  return x / 10n ** (27n - 18n);
}

export function toRay(x: bigint, currentFactor: bigint) {
  return (x * RAY) / currentFactor;
}

export function toWad(x: bigint, currentFactor: bigint) {
  return (x * WAD) / currentFactor;
}

export function tofactor(x: bigint, currentFactor: bigint) {
  return (x * RAY) / currentFactor;
}

export function fromRay(x: bigint, currentFactor: bigint) {
  return (x * currentFactor) / RAY;
}
