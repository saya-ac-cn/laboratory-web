import React, { Component } from 'react';
import './index.less'
import {Redirect, Route, Switch} from 'react-router-dom'
import { Layout,Row, Col,Icon,Menu,Dropdown } from 'antd';
import memoryUtils from '../../../utils/memoryUtils'
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-07-07 - 10:12
 * 描述：
 */
const { Header, Footer, Sider, Content } = Layout;

const onClick = ({ key }) => {
  console.log(`Click on item ${key}`);
};

const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="1">我的信息</Menu.Item>
      <Menu.Item key="2">设置</Menu.Item>
      <Menu.Item key="3">退出</Menu.Item>
    </Menu>
);

// 定义组件（ES6）
class Admin extends Component {

  constructor(props){
    super(props)
    this.state = {
      collapsed: false
    };
    this.handlTabClick = this.handlTabClick.bind(this)
  }

  // 切换面板
  handlTabClick(){
    const collapsed = !this.state.collapsed;
    // 更新状态
    this.setState({collapsed:collapsed})
  }


  render() {
    const user = memoryUtils.user;
    // 如果内存没有存储user ==> 当前没有登陆
    if(!user || !user.user) {
      // 自动跳转到登陆(在render()中)
      return <Redirect to='/login'/>
    }
    // 读取状态
    const {collapsed} = this.state;
    return (
      <div className="container">
        <Row className="header">
          <Col  className={`logo ${collapsed?'logo-collapse-width':'logo-width'}`} span={10}>
            {collapsed?'':'云·实验室中心'}
          </Col>
          <Col span={10}>
            <div className="tools" onClick={this.handlTabClick}>
              <Icon type="appstore" />
            </div>
          </Col>
          <Col className="userinfo" span={4}>
            <Dropdown overlay={menu}>
              <span className="el-dropdown-link userinfo-inner">
                <img src="https://saya.ac.cn/files/picture/logo/Pandora/20190602/2019060212877.png" /> Pandora<Icon type="down" />
              </span>
            </Dropdown>
          </Col>
        </Row>
        <Row className="main">
          <aside className={collapsed?'menu-collapsed':'menu-expanded'}>
            {/*导航菜单*/}
            {/*导航菜单-折叠后*/}
            Sider
          </aside>
          <section>Content</section>
        </Row>
      </div>
    );
  }
}

// 对外暴露
export default Admin;