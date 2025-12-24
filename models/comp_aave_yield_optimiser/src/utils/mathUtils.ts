const MAX_UINT256 = 2n ** 256n - 1n;
const RAY = 10n ** 27n;
const WAD = 10n ** 18n;
const PERCENTAGE_FACTOR = 10_000n;
const HALF_PERCENTAGE_FACTOR = 5_000n;

export function rayMul(x: bigint, y: bigint): bigint {
  return (x * y) / RAY;
}

export function wadMul(x: bigint, y: bigint): bigint {
  return (x * y) / WAD;
}

export function wadDiv(x: bigint, y: bigint): bigint {
  return (x * WAD) / y;
}

export function rayDiv(x: bigint, y: bigint): bigint {
  return (x * RAY) / y;
}

export function percentMul(value: bigint, percentage: bigint): bigint {
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

export function factorMul(x: bigint, y: bigint, factor: bigint): bigint {
  return (x * y) / factor;
}

export function factorDiv(x: bigint, y: bigint, factor: bigint): bigint {
  return (x * factor) / y;
}

export function min(x: bigint, y: bigint): bigint {
  return x < y ? x : y;
}

export function max(x: bigint, y: bigint): bigint {
  return x > y ? x : y;
}

export function abs(x: bigint): bigint {
  return x < 0n ? x * -1n : x;
}
