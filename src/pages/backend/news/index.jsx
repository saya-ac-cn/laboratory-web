import React, { Component } from 'react';
import {Switch, Route, Redirect} from 'react-router-dom'

import NewsList from './list'
import EditPage from './edit'
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-07-27 - 22:01
 * 描述：
 */

// 定义组件（ES6）
class News extends Component {


  render() {
      return (
          <Switch>
              <Route path='/backstage/message/news' component={NewsList} exact/> {/*路径完全匹配*/}
              <Route path='/backstage/message/news/publish' component={EditPage}/>
              <Route path='/backstage/message/news/update' component={EditPage}/>
              <Redirect to='/backstage/message/news'/>
          </Switch>
      )
  }
}

// 对外暴露
export default News;