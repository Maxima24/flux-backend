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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProtocolDto = void 0;
var class_validator_1 = require("class-validator");
var CreateProtocolDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _displayName_decorators;
    var _displayName_initializers = [];
    var _displayName_extraInitializers = [];
    var _chain_decorators;
    var _chain_initializers = [];
    var _chain_extraInitializers = [];
    var _contractAddress_decorators;
    var _contractAddress_initializers = [];
    var _contractAddress_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    var _metadata_decorators;
    var _metadata_initializers = [];
    var _metadata_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateProtocolDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.displayName = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _displayName_initializers, void 0));
                this.chain = (__runInitializers(this, _displayName_extraInitializers), __runInitializers(this, _chain_initializers, void 0));
                this.contractAddress = (__runInitializers(this, _chain_extraInitializers), __runInitializers(this, _contractAddress_initializers, void 0));
                this.category = (__runInitializers(this, _contractAddress_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.isActive = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                this.metadata = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
            return CreateProtocolDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)()];
            _displayName_decorators = [(0, class_validator_1.IsString)()];
            _chain_decorators = [(0, class_validator_1.IsString)()];
            _contractAddress_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _category_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _isActive_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _metadata_decorators = [(0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _displayName_decorators, { kind: "field", name: "displayName", static: false, private: false, access: { has: function (obj) { return "displayName" in obj; }, get: function (obj) { return obj.displayName; }, set: function (obj, value) { obj.displayName = value; } }, metadata: _metadata }, _displayName_initializers, _displayName_extraInitializers);
            __esDecorate(null, null, _chain_decorators, { kind: "field", name: "chain", static: false, private: false, access: { has: function (obj) { return "chain" in obj; }, get: function (obj) { return obj.chain; }, set: function (obj, value) { obj.chain = value; } }, metadata: _metadata }, _chain_initializers, _chain_extraInitializers);
            __esDecorate(null, null, _contractAddress_decorators, { kind: "field", name: "contractAddress", static: false, private: false, access: { has: function (obj) { return "contractAddress" in obj; }, get: function (obj) { return obj.contractAddress; }, set: function (obj, value) { obj.contractAddress = value; } }, metadata: _metadata }, _contractAddress_initializers, _contractAddress_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: function (obj) { return "metadata" in obj; }, get: function (obj) { return obj.metadata; }, set: function (obj, value) { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateProtocolDto = CreateProtocolDto;
