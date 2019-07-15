/**
 * 入口js
 */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'
import {LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
// 读取local中保存user, 保存到内存中
const user = storageUtils.getUser();
memoryUtils.user = user;

// 国际化设置，设置中文
// 将App组件标签渲染到index页面的div上
ReactDOM.render(
    <LocaleProvider locale={zhCN}>
        <App/>
    </LocaleProvider>, document.getElementById('root'));
