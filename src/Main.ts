import MainConfig, { IConfig } from "./config/MainConfig";
import HttpTool from "./http/HttpTool";
import { AddressInfo } from "net";
import fs from "fs";
import path from "path";
import mime from "mime";
import LoaderManager, { ILoaderError } from "./loader/LoaderManager";

/**
 * 主入口
 */
export default class Main {
    /**
     * 开始
     * @param _config 配置信息
     */
    public static start(_config: IConfig) {
        //设置配置信息
        _config = MainConfig.setConfig(_config);
        //开启服务
        HttpTool.createServer((req, res) => {
            //head
            let _head = {
                'Content-Type': 'application/javascript;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',//允许跨域
                'Access-Control-Allow-Headers': 'Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE',//允许跨域
            };
            //
            let _url: string = path.join(_config.rootUrl, _config.binUrl, req.url);
            //get请求
            switch (req.method) {
                case 'GET':
                    //先判断该文件是否存在
                    fs.stat(_url, (err, stats) => {
                        if (err || !stats.isFile()) {
                            res.writeHead(404);
                            res.end();
                            return;
                        }
                        //创建可读流
                        LoaderManager.createLoader(_url, fs.createReadStream(_url)).then((stream) => {
                            res.writeHead(200, {
                                'Content-Type': mime.getType(path.extname(_url)) || '',
                            });
                            stream.pipe(res);
                            //重载
                        }).catch((e: ILoaderError) => {
                            res.writeHead(502);
                            res.end(`loader出错@${e.name}\n${e}`);
                        });

                    });
                    break;
            }
        }, _config.port).then((server) => {
            let _address: AddressInfo = server.address() as AddressInfo;
            //
            console.log(_address);
        });
    }
}