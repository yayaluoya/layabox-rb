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
    /**
     * 创建一个loader线，回依次执行loader列表中的loader并返回一个可读流
     * @param _url 资源路径
     * @param _stream 资源可读流
     */
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
                    .then(function (__stream) {
                    _f(__stream);
                })
                    .catch(function (e) {
                    var _error = {
                        name: _loader.name,
                        error: e,
                    };
                    e(_error);
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