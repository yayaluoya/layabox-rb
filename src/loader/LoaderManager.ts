import fs from "fs";
import MainConfig, { ILoader } from "../config/MainConfig";

/**
 * loader管理器
 */
export default class LoaderManager {
    /**
     * 创建一个loader线，回依次执行loader列表中的loader并返回一个可读流
     * @param _url 资源路径
     * @param _stream 资源可读流
     */
    public static createLoader(_url: string, _stream: fs.ReadStream): Promise<fs.ReadStream> {
        let _loaders: ILoader[] = [...MainConfig.config.loader];
        return new Promise<fs.ReadStream>((r, e) => {
            let _f = (_stream) => {
                if (_loaders.length == 0) {
                    r(_stream);
                    return;
                }
                let _loader: ILoader = _loaders.shift();
                _loader.loader(_url, _stream)
                    .then((__stream) => {
                        _f(__stream);
                    })
                    .catch((e) => {
                        let _error: ILoaderError = {
                            name: _loader.name,
                            error: e,
                        };
                        e(_error);
                    });
            }
            //
            _f(_stream);
        });
    }
}

/**
 * loader错误接口
 */
export interface ILoaderError {
    /** 装载器名称 */
    name: string,
    /** 错误 */
    error: any,
}