import MainConfig, { IConfig } from "./config/MainConfig";
import HttpTool from "./http/HttpTool";
import { AddressInfo } from "net";
import fs from "fs";
import path from "path";
import mime from "mime";
import LoaderManager, { ILoaderError } from "./loader/LoaderManager";
import chalk from "chalk";
import { Stream } from "stream";

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
            let __url: string = path.join(_config.rootUrl, _config._binUrl, req.url);
            //url解码
            _url = decodeURI(_url);
            __url = decodeURI(__url);
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
                        let _readStream = fs.createReadStream(_url);
                        LoaderManager.createLoader(_url, _readStream).then((stream) => {
                            //创建目录
                            mkdir(__url).then(() => {
                                //创建转存可写流
                                let _stream = fs.createWriteStream(__url);
                                //同时流向两个目标可写流
                                try {
                                    res.writeHead(200, {
                                        ..._head,
                                        'Content-Type': mime.getType(path.extname(_url)) || '',
                                    });
                                    stream.on('data', (data) => {
                                        _stream.write(data);
                                        res.write(data);
                                    });
                                    stream.on('end', () => {
                                        _stream.end();
                                        res.end();
                                    });
                                    //不知道为什么不能用链式管道
                                    // stream.pipe(res).pipe(_stream);
                                } catch (e) {
                                    res.writeHead(502);
                                    res.end();
                                    console.log('转存文件时管道链出错', e);
                                }
                            }).catch((e) => {
                                res.writeHead(502);
                                res.end();
                            });
                        }).catch((e: ILoaderError) => {
                            res.writeHead(502);
                            res.end();
                            console.log(`loader出错@${e.name}\n${e}`);
                        });

                    });
                    break;
            }
        }, _config.port).then((server) => {
            let _address: AddressInfo = server.address() as AddressInfo;
            //
            //提示bin目录的主页地址
            console.log(chalk.gray('---->'));
            console.log(chalk.magenta('本地主页:'), chalk.blue(`http://localhost:${_address.port}`));
            console.log(chalk.magenta('局域网主页:'), chalk.blue(`http://${HttpTool.getHostname}:${_address.port}`));
            console.log(chalk.gray('...'));
        });
    }
}

/**
 * 根据url创建目录
 * @param _url url
 */
function mkdir(_url: string): Promise<void> {
    _url = path.dirname(_url);
    return new Promise((r, e) => {
        //先判断是否有目标目录
        fs.stat(_url, (err, stats) => {
            if (err || !stats.isDirectory) {
                //递归创建目录
                fs.mkdir(_url, { recursive: true }, (err) => {
                    if (err) {
                        console.log(`转存文件时创建目录失败@${_url}`, err);
                        e();
                        return;
                    }
                    r();
                });
            } else {
                r();
            }
        });
    });
}