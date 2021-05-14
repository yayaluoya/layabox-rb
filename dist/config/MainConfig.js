"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var ResUrl_1 = __importDefault(require("../_T/ResUrl"));
/**
 * 主配置文件
 */
var MainConfig = /** @class */ (function () {
    function MainConfig() {
    }
    Object.defineProperty(MainConfig, "config", {
        /** 获取配置信息 */
        get: function () {
            return this.m_config;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 设置配置信息
     * @param _config 配置信息
     */
    MainConfig.setConfig = function (_config) {
        //根路径转绝对路径
        (!path_1.isAbsolute(_config.rootUrl)) && (_config.rootUrl = path_1.resolve(ResUrl_1.default.cwdUrl, _config.rootUrl));
        //
        this.m_config = _config;
        //
        return this.m_config;
    };
    return MainConfig;
}());
exports.default = MainConfig;
//# sourceMappingURL=MainConfig.js.map