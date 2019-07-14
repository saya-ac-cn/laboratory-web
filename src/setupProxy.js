const proxy = require('http-proxy-middleware');

// 配置多个跨域设置
//重要说明！！！
//页面路由绝对禁止出现/backend、/frontend、/files（远景包括map）
//在定义接口代理时，上述的路由单词已经被定义，如果使用，刷新页面将出现404，
module.exports = function(app) {
    // ...You can now register proxies as you wish!
    app.use(proxy('/backend/**', {
        target: 'http://laboratory.saya.ac.cn',
        changeOrigin: true,
    }));
    app.use(proxy('/frontend/**', {
        target: 'http://laboratory.saya.ac.cn',
        changeOrigin: true,
    }));
    app.use(proxy('/files/**', {
        target: 'http://laboratory.saya.ac.cn',
        changeOrigin: true,
    }));
};