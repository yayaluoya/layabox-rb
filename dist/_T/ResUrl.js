"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
/**
 * 通用资源路径
 */
var ResUrl = /** @class */ (function () {
    function ResUrl() {
    }
    Object.defineProperty(ResUrl, "rootUrl", {
        /** 获取工具跟目录 */
        get: function () {
            return path_1.join(__dirname, '../../');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResUrl, "cwdUrl", {
        /** 获取进程执行目录 */
        get: function () {
            return process.cwd();
        },
        enumerable: false,
        configurable: true
    });
    return ResUrl;
}());
exports.default = ResUrl;
//# sourceMappingURL=ResUrl.js.map