"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MainConfig_1 = __importDefault(require("./config/MainConfig"));
var HttpTool_1 = __importDefault(require("./http/HttpTool"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var mime_1 = __importDefault(require("mime"));
var LoaderManager_1 = __importDefault(require("./loader/LoaderManager"));
var chalk_1 = __importDefault(require("chalk"));
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
            var __url = path_1.default.join(_config.rootUrl, _config._binUrl, req.url);
            //url解码
            _url = decodeURI(_url);
            __url = decodeURI(__url);
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
                        //创建可读流
                        var _readStream = fs_1.default.createReadStream(_url);
                        LoaderManager_1.default.createLoader(_url, _readStream).then(function (stream) {
                            //创建目录
                            mkdir(__url).then(function () {
                                //创建转存可写流
                                var _stream = fs_1.default.createWriteStream(__url);
                                //同时流向两个目标可写流
                                try {
                                    res.writeHead(200, __assign(__assign({}, _head), { 'Content-Type': mime_1.default.getType(path_1.default.extname(_url)) || '' }));
                                    stream.on('data', function (data) {
                                        _stream.write(data);
                                        res.write(data);
                                    });
                                    stream.on('end', function () {
                                        _stream.end();
                                        res.end();
                                    });
                                    //不知道为什么不能用链式管道
                                    // stream.pipe(res).pipe(_stream);
                                }
                                catch (e) {
                                    res.writeHead(502);
                                    res.end();
                                    console.log('转存文件时管道链出错', e);
                                }
                            }).catch(function (e) {
                                res.writeHead(502);
                                res.end();
                            });
                        }).catch(function (e) {
                            res.writeHead(502);
                            res.end();
                            console.log("loader\u51FA\u9519@" + e.name + "\n" + e);
                        });
                    });
                    break;
            }
        }, _config.port).then(function (server) {
            var _address = server.address();
            //
            //提示bin目录的主页地址
            console.log(chalk_1.default.gray('---->'));
            console.log(chalk_1.default.magenta('本地主页:'), chalk_1.default.blue("http://localhost:" + _address.port));
            console.log(chalk_1.default.magenta('局域网主页:'), chalk_1.default.blue("http://" + HttpTool_1.default.getHostname + ":" + _address.port));
            console.log(chalk_1.default.gray('...'));
        });
    };
    return Main;
}());
exports.default = Main;
/**
 * 根据url创建目录
 * @param _url url
 */
function mkdir(_url) {
    _url = path_1.default.dirname(_url);
    return new Promise(function (r, e) {
        //先判断是否有目标目录
        fs_1.default.stat(_url, function (err, stats) {
            if (err || !stats.isDirectory) {
                //递归创建目录
                fs_1.default.mkdir(_url, { recursive: true }, function (err) {
                    if (err) {
                        console.log("\u8F6C\u5B58\u6587\u4EF6\u65F6\u521B\u5EFA\u76EE\u5F55\u5931\u8D25@" + _url, err);
                        e();
                        return;
                    }
                    r();
                });
            }
            else {
                r();
            }
        });
    });
}
//# sourceMappingURL=Main.js.map