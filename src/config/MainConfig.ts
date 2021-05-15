import { isAbsolute, resolve } from "path";
import ResUrl from "../_T/ResUrl";
import fs from "fs";

/**
 * 主配置文件
 */
export default class MainConfig {
    /** 配置信息 */
    private static m_config: IConfig;

    /** 获取配置信息 */
    public static get config(): IConfig {
        return this.m_config;
    }

    /**
     * 设置配置信息
     * @param _config 配置信息
     */
    public static setConfig(_config: IConfig): IConfig {
        //根路径转绝对路径
        (!isAbsolute(_config.rootUrl)) && (_config.rootUrl = resolve(ResUrl.cwdUrl, _config.rootUrl));
        //
        this.m_config = _config;
        //
        return this.m_config;
    }
}

/**
 * 配置信息接口
 */
export interface IConfig {
    /** 项目地址，可以是相对执行目录的地址也可以是一个绝对地址 */
    rootUrl: string,
    /** bin目录地址，相对于项目地址 */
    binUrl: string,
    /** 复制bin目录地址，从bin目录下提取出的资源将会被放在该目录下，相对于项目地址 */
    _binUrl: string,
    /** 端口 */
    port: number,
    /** loader列表 */
    loader: ILoader[];
}

/**
 * loader接口
 */
export interface ILoader {
    /**
     * loader名字
     */
    name: string,

    /**
     * loader
     * @param _url 资源地址
     * @param _stream 资源暂停模式的可读流，传出的可读取也必须是暂停模式，不然异步会丢失数据
     */
    loader(_url: string, _stream: fs.ReadStream): Promise<fs.ReadStream>;
}