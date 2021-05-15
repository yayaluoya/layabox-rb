"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
/**
 * 文件转存工具
 */
var FileDump = /** @class */ (function () {
    function FileDump() {
    }
    /**
     * 转存文件
     * @param _path 文件路径
     * @param _stream 文件可读流
     */
    FileDump.dumpFile = function (_path, _stream) {
        _stream.pipe(fs_1.default.createWriteStream(_path));
    };
    return FileDump;
}());
exports.default = FileDump;
//# sourceMappingURL=FileDump.js.map