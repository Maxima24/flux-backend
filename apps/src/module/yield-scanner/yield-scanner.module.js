"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YieldScannerModule = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = require("@nestjs/axios");
var cache_manager_1 = require("@nestjs/cache-manager");
var config_1 = require("@nestjs/config");
var redisStore = require("cache-manager-redis-store");
var yield_scanner_service_1 = require("./yield-scanner.service");
var yield_scanner_controller_1 = require("./yield-scanner.controller");
var aave_provider_1 = require("../providers/aave.provider");
var quickswap_provider_1 = require("../providers/quickswap.provider");
var defillama_provider_1 = require("../providers/defillama.provider");
var blockchain_module_1 = require("../blockchain/blockchain.module");
var YieldScannerModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                axios_1.HttpModule.register({
                    timeout: 10000,
                    maxRedirects: 5,
                }),
                blockchain_module_1.BlockchainModule,
                cache_manager_1.CacheModule.registerAsync({
                    imports: [config_1.ConfigModule],
                    useFactory: function (config) { return ({
                        store: redisStore,
                        host: config.get('database.redis.host'),
                        port: config.get('database.redis.port'),
                        password: config.get('database.redis.password'),
                        ttl: config.get('database.cacheTTL.yields'),
                    }); },
                    inject: [config_1.ConfigService],
                }),
            ],
            controllers: [yield_scanner_controller_1.YieldScannerController],
            providers: [
                yield_scanner_service_1.YieldScannerService,
                aave_provider_1.AaveProvider,
                quickswap_provider_1.QuickswapProvider,
                defillama_provider_1.DeFiLlamaProvider,
            ],
            exports: [yield_scanner_service_1.YieldScannerService],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var YieldScannerModule = _classThis = /** @class */ (function () {
        function YieldScannerModule_1() {
        }
        return YieldScannerModule_1;
    }());
    __setFunctionName(_classThis, "YieldScannerModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        YieldScannerModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return YieldScannerModule = _classThis;
}();
exports.YieldScannerModule = YieldScannerModule;
