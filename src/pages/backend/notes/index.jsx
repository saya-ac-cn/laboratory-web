import React, { Component } from 'react';
import {Switch, Route, Redirect} from 'react-router-dom'

import NotesList from './list'
import createNotes from './edit'
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-07-27 - 22:01
 * 描述：笔记便笺管理
 */

// 定义组件（ES6）
class Notes extends Component {


  render() {
      return (
          <Switch>
              <Route path='/backstage/grow/notes' component={NotesList} exact/> {/*路径完全匹配*/}
              <Route path='/backstage/grow/notes/create' component={createNotes}/>
              <Route path='/backstage/grow/notes/update' component={createNotes}/>
              <Redirect to='/backstage/grow/notes'/>
          </Switch>
      )
  }
}

// 对外暴露
export default Notes;