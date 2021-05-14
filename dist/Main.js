"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MainConfig_1 = __importDefault(require("./config/MainConfig"));
var HttpTool_1 = __importDefault(require("./http/HttpTool"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var mime_1 = __importDefault(require("mime"));
/**
 * 主入口
 */
var Main = /** @class */ (function () {
    function Main() {
    }
    /**
     * 开始
     * @param _config 配置信息
     */
    Main.start = function (_config) {
        //设置配置信息
        _config = MainConfig_1.default.setConfig(_config);
        //开启服务
        HttpTool_1.default.createServer(function (req, res) {
            //head
            var _head = {
                'Content-Type': 'application/javascript;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE', //允许跨域
            };
            //
            var _url = path_1.default.join(_config.rootUrl, _config.binUrl, req.url);
            //get请求
            switch (req.method) {
                case 'GET':
                    //先判断该文件是否存在
                    fs_1.default.stat(_url, function (err, stats) {
                        if (err || !stats.isFile()) {
                            res.writeHead(404);
                            res.end();
                            return;
                        }
                        //
                        res.writeHead(200, {
                            'Content-Type': mime_1.default.getType(path_1.default.extname(_url)) || '',
                        });
                        //创建管道
                        var stream = fs_1.default.createReadStream(_url);
                        stream.pipe(res);
                    });
                    break;
            }
        }, _config.port).then(function (server) {
            var _address = server.address();
            //
            console.log(_address);
        });
    };
    return Main;
}());
exports.default = Main;
//# sourceMappingURL=Main.js.map