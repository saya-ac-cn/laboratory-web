const proxy = require('http-proxy-middleware');

const dev = "http://127.0.0.1:8080";
const pro = "http://laboratory.saya.ac.cn";
const url = dev;

// 配置多个跨域设置
//重要说明！！！
//页面路由绝对禁止出现/backend、/frontend、/files（远景包括map）
//在定义接口代理时，上述的路由单词已经被定义，如果使用，刷新页面将出现404，
module.exports = function (app) {
    // ...You can now register proxies as you wish!
    app.use(proxy('/backend/**', {
        target: url,
        changeOrigin: true,
    }));
    app.use(proxy('/frontend/**', {
        target: url,
        changeOrigin: true,
    }));
    app.use(proxy('/files/**', {
        target: url,
        changeOrigin: true,
    }));
};