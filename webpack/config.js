// 本地服务端口
const port = 4001;
// 是否是发布环境
const isProd = process.env.NODE_ENV === 'production';
/**
 * 本地开发环境 publicPath 始终为 / 不需要修改
 * 如果访问路径在根目录，例如：http://1.1.1.1:11112/index.html 则需要指定 publicPath 为 /
 * 如果访问路径不在根目录，例如：http://1.1.1.1:14700/xxx-front 则需要指定 publicPath 为 /xxx-front/           注意！！！结尾的 / 是必须的
 *
 */
module.exports = {
    appTitle: '一点博客',
    publicPath: isProd ? '/' : '/',
    port: port,
    outDirName: 'static',
    devtool: isProd ? '' : 'cheap-module-source-map',
    imgLimit: 10000,
    isProd: isProd,
    hot: true,
    // 开启后，使用 yarn run build 后可以分析打包文件
    isAnalyzer: false
};
