"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcCompUtilization = calcCompUtilization;
exports.calcCompUtilizationDerivative = calcCompUtilizationDerivative;
exports.calcCompUtilizationSecondDerivative = calcCompUtilizationSecondDerivative;
exports.calcCompSupplyRate = calcCompSupplyRate;
exports.calcCompSupplyRateDerivative = calcCompSupplyRateDerivative;
exports.calcCompSupplyRateSecondDerivative = calcCompSupplyRateSecondDerivative;
exports.calcCompThreshold = calcCompThreshold;
// Max UINT256 for overflow simulation (optional, but strictly equivalent)
var SECONDS_PER_YEAR = 31536000n;
var WAD = Math.pow(10n, 18n);
function calcCompUtilization(x, params) {
    var totalSupply = params.totalSupply, totalBorrow = params.totalBorrow;
    return wadDiv(totalBorrow, totalSupply + x);
}
function calcCompUtilizationDerivative(x, params) {
    var totalBorrow = params.totalBorrow, decimals = params.decimals;
    var decimalFactor = Math.pow(10n, decimals);
    var totalBorrowWAD = wadDiv(totalBorrow, decimalFactor);
    var utilization = calcCompUtilization(x, params);
    var mod = Math.pow(utilization, 2n) / totalBorrowWAD;
    return -1n * mod;
}
function calcCompUtilizationSecondDerivative(x, params) {
    var totalBorrow = params.totalBorrow, decimals = params.decimals;
    var decimalFactor = Math.pow(10n, decimals);
    var totalBorrowWAD = wadDiv(totalBorrow, decimalFactor);
    var utilization = calcCompUtilization(x, params);
    return (2n * Math.pow(utilization, 3n)) / Math.pow(totalBorrowWAD, 2n);
}
function calcCompSupplyRate(x, params) {
    var supplyKink = params.supplyKink, supplyPerSecondInterestRateBase = params.supplyPerSecondInterestRateBase, supplyPerSecondInterestRateSlopeLow = params.supplyPerSecondInterestRateSlopeLow, supplyPerSecondInterestRateSlopeHigh = params.supplyPerSecondInterestRateSlopeHigh;
    var utilizationValue = calcCompUtilization(x, params);
    if (utilizationValue <= supplyKink) {
        return ((supplyPerSecondInterestRateBase +
            wadMul(supplyPerSecondInterestRateSlopeLow, utilizationValue)) *
            SECONDS_PER_YEAR);
    }
    else {
        return ((supplyPerSecondInterestRateBase +
            wadMul(supplyPerSecondInterestRateSlopeLow, supplyKink) +
            wadMul(supplyPerSecondInterestRateSlopeHigh, utilizationValue - supplyKink)) *
            SECONDS_PER_YEAR);
    }
}
function calcCompSupplyRateDerivative(x, params) {
    var supplyKink = params.supplyKink, supplyPerSecondInterestRateSlopeLow = params.supplyPerSecondInterestRateSlopeLow, supplyPerSecondInterestRateSlopeHigh = params.supplyPerSecondInterestRateSlopeHigh;
    var utilizationValue = calcCompUtilization(x, params);
    var utilizationDerivativeValue = calcCompUtilizationDerivative(x, params);
    if (utilizationValue <= supplyKink) {
        return (wadMul(utilizationDerivativeValue, supplyPerSecondInterestRateSlopeLow) *
            SECONDS_PER_YEAR);
    }
    else {
        return (wadMul(utilizationDerivativeValue, supplyPerSecondInterestRateSlopeHigh) *
            SECONDS_PER_YEAR);
    }
}
function calcCompSupplyRateSecondDerivative(x, params) {
    var supplyKink = params.supplyKink, supplyPerSecondInterestRateSlopeLow = params.supplyPerSecondInterestRateSlopeLow, supplyPerSecondInterestRateSlopeHigh = params.supplyPerSecondInterestRateSlopeHigh;
    var utilizationValue = calcCompUtilization(x, params);
    var utilizationSecondDerivativeValue = calcCompUtilizationSecondDerivative(x, params);
    if (utilizationValue <= supplyKink) {
        return (wadMul(utilizationSecondDerivativeValue, supplyPerSecondInterestRateSlopeLow) * SECONDS_PER_YEAR);
    }
    else {
        return (wadMul(utilizationSecondDerivativeValue, supplyPerSecondInterestRateSlopeHigh) * SECONDS_PER_YEAR);
    }
}
function calcCompThreshold(params) {
    var totalBorrow = params.totalBorrow, totalSupply = params.totalSupply, supplyKink = params.supplyKink, decimals = params.decimals;
    var decimalFactor = Math.pow(10n, decimals);
    var totalBorrowWAD = wadDiv(totalBorrow, decimalFactor);
    var totalSupplyWAD = wadDiv(totalSupply, decimalFactor);
    return (((totalBorrowWAD - wadMul(totalSupplyWAD, supplyKink)) * decimalFactor) /
        supplyKink);
}
function wadDiv(x, y) {
    return (x * WAD) / y;
}
function wadMul(x, y) {
    return (x * y) / WAD;
}
// export class CompoundProtocol {
//   params: CompoundProtocolConstants;
//   constructor(params: CompoundProtocolConstants) {
//     this.params = params;
//   }
//   utilization(x: bigint): bigint {
//     const { totalSupply, totalBorrow } = this.params;
//     return wadDiv(totalBorrow, totalSupply + x);
//   }
//   utilizationDerivative(x: bigint): bigint {
//     const { totalBorrow, decimals } = this.params;
//     let decimalFactor = 10n ** decimals;
//     let totalBorrowWAD = wadDiv(totalBorrow, decimalFactor);
//     let utilization = this.utilization(x);
//     // total Borrow is in asset decimals but utilization is in WAD
//     let mod = utilization ** 2n / totalBorrowWAD;
//     return -1n * mod;
//   }
//   utilizationSecondDerivative(x: bigint): bigint {
//     const { totalBorrow, decimals } = this.params;
//     let decimalFactor = 10n ** decimals;
//     let totalBorrowWAD = wadDiv(totalBorrow, decimalFactor);
//     let utilization = this.utilization(x);
//     return (2n * utilization ** 3n) / totalBorrowWAD ** 2n;
//   }
//   supplyRate(x: bigint): bigint {
//     const {
//       supplyKink,
//       supplyPerSecondInterestRateBase,
//       supplyPerSecondInterestRateSlopeLow,
//       supplyPerSecondInterestRateSlopeHigh,
//     } = this.params;
//     const utilization = this.utilization(x);
//     if (utilization <= supplyKink) {
//       return wadMul(
//         supplyPerSecondInterestRateBase +
//           wadMul(supplyPerSecondInterestRateSlopeLow, utilization),
//         SECONDS_PER_YEAR
//       );
//     } else {
//       return (
//         (supplyPerSecondInterestRateBase +
//           wadMul(supplyPerSecondInterestRateSlopeLow, supplyKink) +
//           wadMul(
//             supplyPerSecondInterestRateSlopeHigh,
//             utilization - supplyKink
//           )) *
//         SECONDS_PER_YEAR
//       );
//     }
//   }
//   /**
//    *
//    * @param x The aamount in asset decimals
//    *
//    * @returns K'(x)in wad
//    */
//   supplyRateDerivative(x: bigint): bigint {
//     const {
//       supplyKink,
//       supplyPerSecondInterestRateSlopeLow,
//       supplyPerSecondInterestRateSlopeHigh,
//     } = this.params;
//     const utilization = this.utilization(x);
//     let utilizationDerivative = this.utilizationDerivative(x);
//     if (utilization <= supplyKink) {
//       return (
//         wadMul(utilizationDerivative, supplyPerSecondInterestRateSlopeLow) *
//         SECONDS_PER_YEAR
//       );
//     } else {
//       return (
//         wadMul(utilizationDerivative, supplyPerSecondInterestRateSlopeHigh) *
//         SECONDS_PER_YEAR
//       );
//     }
//   }
//   supplyRateSecondDerivative(x: bigint): bigint {
//     const {
//       supplyKink,
//       supplyPerSecondInterestRateSlopeLow,
//       supplyPerSecondInterestRateSlopeHigh,
//     } = this.params;
//     const utilization = this.utilization(x);
//     const utilizationSecondDerivative = this.utilizationSecondDerivative(x);
//     if (utilization <= supplyKink) {
//       return (
//         wadMul(
//           utilizationSecondDerivative,
//           supplyPerSecondInterestRateSlopeLow
//         ) * SECONDS_PER_YEAR
//       );
//     } else {
//       return (
//         wadMul(
//           utilizationSecondDerivative,
//           supplyPerSecondInterestRateSlopeHigh
//         ) * SECONDS_PER_YEAR
//       );
//     }
//   }
//   /**
//    *
//    * @returns The threshold amount of tokens
//    *
//    */
//   threshold(): bigint {
//     const { totalBorrow, totalSupply, supplyKink, decimals } = this.params;
//     let decimalFactor = 10n ** decimals;
//     let totalBorrowWAD = wadDiv(totalBorrow, decimalFactor);
//     let totalSupplyWAD = wadDiv(totalSupply, decimalFactor);
//     // theshold is in asset decimal factor
//     return (
//       ((totalBorrowWAD - wadMul(totalSupplyWAD, supplyKink)) * decimalFactor) /
//       supplyKink
//     );
//   }
// }
