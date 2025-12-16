"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = (_a = globalThis.prisma) !== null && _a !== void 0 ? _a : new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});
if (process.env.NODE_ENV !== 'production')
    globalThis.prisma = prisma;
exports.default = prisma;
