"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MainConfig_1 = __importDefault(require("../config/MainConfig"));
/**
 * loader管理器
 */
var LoaderManager = /** @class */ (function () {
    function LoaderManager() {
    }
    LoaderManager.createLoader = function (_url, _stream) {
        var _loaders = __spreadArray([], MainConfig_1.default.config.loader);
        return new Promise(function (r, e) {
            var _f = function (_stream) {
                if (_loaders.length == 0) {
                    r(_stream);
                    return;
                }
                var _loader = _loaders.shift();
                _loader.loader(_url, _stream)
                    .then()
                    .catch(function (e) {
                    console.log(_loader.name + "\u51FA\u9519\u4E86\u3002");
                    console.log(e);
                    r(_stream);
                });
            };
            //
            _f(_stream);
        });
    };
    return LoaderManager;
}());
exports.default = LoaderManager;
//# sourceMappingURL=LoaderManager.js.map