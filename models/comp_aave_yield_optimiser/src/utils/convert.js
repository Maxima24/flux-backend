"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromray = fromray;
exports.wadToRay = wadToRay;
exports.rayTowad = rayTowad;
exports.toRay = toRay;
exports.toWad = toWad;
exports.tofactor = tofactor;
exports.fromRay = fromRay;
var RAY = Math.pow(10n, 27n);
var WAD = Math.pow(10n, 18n);
function fromray(x, factor) {
    return (x * factor) / RAY;
}
function wadToRay(x) {
    return toRay(x, Math.pow(10n, 18n));
}
function rayTowad(x) {
    return x / Math.pow(10n, (27n - 18n));
}
function toRay(x, currentFactor) {
    return (x * RAY) / currentFactor;
}
function toWad(x, currentFactor) {
    return (x * WAD) / currentFactor;
}
function tofactor(x, currentFactor) {
    return (x * RAY) / currentFactor;
}
function fromRay(x, currentFactor) {
    return (x * currentFactor) / RAY;
}
