module.exports = {
    /** 项目地址，可以是相对执行目录的地址也可以是一个绝对地址 */
    rootUrl: './test',
    /** loader列表 */
    loader: [{
        name: 'hh',
        loader: (_url, _stream) => {
            console.log(_url);
            return Promise.resolve(_stream);
        },
    }],
};