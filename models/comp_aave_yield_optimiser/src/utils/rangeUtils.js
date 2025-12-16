"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validRange = exports.innerBoundary = exports.isOutsideRange = exports.deriveRanges = void 0;
var mathUtils_js_1 = require("./mathUtils.js");
var MIN_UINT256 = -1n * Math.pow(2n, 255n);
var MAX_UINT256 = Math.pow(2n, 256n) - 1n;
var RAY = Math.pow(10n, 27n);
var deriveRanges = function (a, c) {
    var lower = (0, mathUtils_js_1.min)(a, c);
    var higher = (0, mathUtils_js_1.max)(a, c);
    var rang1 = [MIN_UINT256, lower];
    var range2 = [lower, higher];
    var range3 = [higher, MAX_UINT256];
    return [rang1, range2, range3];
};
exports.deriveRanges = deriveRanges;
var isOutsideRange = function (a, range) {
    return a < range[0] || a > range[1];
};
exports.isOutsideRange = isOutsideRange;
var innerBoundary = function (superBoundary, comparison) {
    var lowerBounadry = (0, mathUtils_js_1.max)(superBoundary[0], comparison[0]);
    var higherBounadry = (0, mathUtils_js_1.max)((0, mathUtils_js_1.min)(superBoundary[1], comparison[1]), lowerBounadry);
    return [lowerBounadry, higherBounadry];
};
exports.innerBoundary = innerBoundary;
var validRange = function (range) {
    return range[1] - range[0] > 0;
};
exports.validRange = validRange;
