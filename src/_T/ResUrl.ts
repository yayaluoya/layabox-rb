import { join } from "path";

/**
 * 通用资源路径
 */
export default class ResUrl {
    /** 获取工具跟目录 */
    public static get rootUrl(): string {
        return join(__dirname, '../../');
    }

    /** 获取进程执行目录 */
    public static get cwdUrl(): string {
        return process.cwd();
    }
}