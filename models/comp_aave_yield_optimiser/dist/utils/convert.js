const RAY = 10n ** 27n;
const WAD = 10n ** 18n;
export function fromray(x, factor) {
    return (x * factor) / RAY;
}
export function wadToRay(x) {
    return toRay(x, 10n ** 18n);
}
export function rayTowad(x) {
    return x / 10n ** (27n - 18n);
}
export function toRay(x, currentFactor) {
    return (x * RAY) / currentFactor;
}
export function toWad(x, currentFactor) {
    return (x * WAD) / currentFactor;
}
export function tofactor(x, currentFactor) {
    return (x * RAY) / currentFactor;
}
export function fromRay(x, currentFactor) {
    return (x * currentFactor) / RAY;
}
//# sourceMappingURL=convert.js.map