import React, { Component } from 'react';
import './index.less'
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-07-09 - 22:31
 * 描述：
 */

// 定义组件（ES6）
class Log extends Component {

  render() {
    return (
      <div style={{backgroundColor:"pink"}}>
        日志
      </div>
    );
  }
}

// 对外暴露
export default Log;