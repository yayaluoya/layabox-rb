#!/usr/bin/env node
const package = require('../package');
const { Command } = require('commander');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const layabox_rb = require('../dist/Main.js');
/** 默认配置 */
const defaultConfig = require('../config.js');
/** 配置文件名字 */
const configName = 'layabox_rb_config.js';
//
const program = new Command();

//定义版本输出
program
    .version(package.version);

//定义其它选项
program
    .option('-i --init')
    .option('-h, --help_')//防止和help重复
    .option('-s, --start')
    .option('-c, --config <url>')
    .option('--log-config [url]')
    ;

//定义命令行类型
program
    .parse(process.argv);

//获取参数结果
const options = program.opts();
// console.log(options);
//执行目录
let _cwdUrl = process.cwd();
let _config = {};
switch (true) {
    //初始化
    case Boolean(options.init):
        let _defaultConfigUrl = path.join(__dirname, '../config.js');
        let _configUrl = path.join(_cwdUrl, configName);
        //先查看是否有该文件
        fs.stat(_configUrl, (err, stats) => {
            if (!err && stats.isFile()) {
                console.log(chalk.red('配置文件已经存在，请在该文件上添加配置。', _configUrl));
                return;
            }
            //
            let stream = fs.createReadStream(_defaultConfigUrl).pipe(fs.createWriteStream(_configUrl));
            stream.on('close', () => {
                console.log(chalk.green('配置文件初始化完成。'));
            });
        });
        //
        break;
    //帮助
    case Boolean(options.help_):
        console.log('\n');
        console.log(chalk.green('layabox-rb工具的全部命令选项:'));
        console.log(chalk.gray('->'));
        console.log(chalk.magenta('快捷命令 lrb'));
        console.log(chalk.blue('-i'), chalk.gray('在当前执行目录初始化配置文件'));
        console.log(chalk.blue('-h'), chalk.gray('获取帮助信息'));
        console.log(chalk.blue('-s'), chalk.gray('开始运行项目'));
        console.log(chalk.blue('-c'), chalk.yellow('<url>'), chalk.gray('指定配置文件来运行项目，参数为配置文件url，可以是绝对路径或者相对路径'));
        console.log(chalk.blue('--log-config'), chalk.yellow('[url]'), chalk.gray('查看配置，不填的话则打印默认配置信息'));
        console.log(chalk.gray('-'));
        console.log(chalk.gray('注意：参数是不用带\'或者\"符号的。'));
        break;
    //查看配置
    case Boolean(options.logConfig):
        //
        console.log(chalk.yellow('配置数据:\n'));
        //
        if (typeof options.logConfig == 'string') {
            _config = getConfig(options.logConfig) || _config;
        } else {
            //默认在项目执行目录下找配置文件
            _config = getConfig(path.join(_cwdUrl, configName), false) || _config;
        }
        //组合配置内容
        _config = {
            ...defaultConfig,
            ..._config,
        };
        // console.log(_config);
        //把config中的根路径转成绝对路径
        (!path.isAbsolute(_config.rootUrl)) && (_config.rootUrl = path.resolve(_cwdUrl, _config.rootUrl));
        //
        console.log(_config);
        break;
    //指定配置构建
    case Boolean(options.config):
        _config = getConfig(options.config);
        build(_config);
        break;
    //开始构建
    case Boolean(options.start):
        _config = getConfig(path.join(_cwdUrl, configName), false);
        build(_config);
        break;
    //直接执行
    default:
        _config = getConfig(path.join(_cwdUrl, configName), false);
        build(_config);
        break;
}

/**
 * 开始构建
 * @param {*} _config 配置信息
 */
function build(_config = {}) {
    //开始
    layabox_rb.default.start({
        //默认配置
        ...defaultConfig,
        //新增配置
        ..._config,
    });
}

/**
 * 通过一个地址获取配置信息
 * @param {*} _url 地址 可以是相对地址也可以是绝对地址
 * @param {*} _ifAlert 当获取失败时是否发出提示信息
 */
function getConfig(_url, _ifAlert = true) {
    //执行目录
    let _cwdUrl = process.cwd();
    let _config;
    if (_url) {
        //配置文件路径
        _url = path.isAbsolute(_url) ? _url : path.resolve(_cwdUrl, _url);
        try {
            //动态导入配置，判断路径是否是绝对路径
            _config = require(_url);
        } catch (e) {
            //
            _ifAlert && console.log(chalk.red('获取配置文件失败，将使用默认配置！错误地址为: ', _url));
        }
    }
    //
    return _config;
}