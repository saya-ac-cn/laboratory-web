# 项目说明
## 重要说明！！！
* 页面路由绝对禁止出现/backend、/frontend、/files（远景包括map）
* 在定义接口代理时，上述的路由单词已经被定义，如果使用，刷新页面将出现404，
## 参考
* https://github.com/zxfjd3g/190105_ReactAdmin
## 安装antd
* npm install antd 或 yarn add antd
## 按需加载
* npm install  react-app-rewired customize-cra babel-plugin-import
* 在根目录创建config-overrides.js文件，并写入内容
* 修改package.json文件
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
改为：
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
  },
  目的是启动运行项目时加载config-overrides.js配置文件
## 自定义主题
* 下载工具包 npm install less less-loader  
* 修改config-overrides.js
## 引入路由
* npm add react-router-dom
## 安装 axios
* npm add axios
## 安装 store
* npm install store
## 安装 http-proxy-middleware 用于设置多个代理
* npm install  http-proxy-middleware
## 安装cropper（图片裁剪）
* npm install react-cropper
## 安装富文本编辑器
* npm install react-draft-wysiwyg
## 安装draftjs转换html
* npm install draftjs-to-html
