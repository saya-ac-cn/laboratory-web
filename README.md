# 项目说明
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
