import React, { Component } from 'react';
import './index.less'
import {Redirect, Route, Switch,Link, withRouter} from 'react-router-dom'
import { Layout,Row, Col,Icon,Menu,Dropdown,Breadcrumb, } from 'antd';
import menuConfig from '../../../config/backendMenuConfig'
import memoryUtils from '../../../utils/memoryUtils'
import Log from '../../backend/log'
import DB from '../../backend/db'
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-07-07 - 10:12
 * 描述：
 */
const { Header, Footer, Sider, Content, } = Layout;
const { SubMenu } = Menu;

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

  rootSubmenuKeys = ['sub1', 'sub2', 'sub3','sub4', 'sub5', 'sub6'];

  constructor(props){
    super(props);
    this.state = {
      collapsed: false,
      openKeys: [],
    };
  }

  /*
 根据menu的数据数组生成对应的标签数组
 使用reduce() + 递归调用
 */
  getMenuNodes = (menuList) => {
    // 得到当前请求的路由路径
    const path = this.props.location.pathname;
    return menuList.reduce((pre, item) => {
        // 向pre添加<Menu.Item>
        if(!item.children && item.hidden === false) {
          pre.push((
              <Menu.Item key={item.key}><Link to={item.key}>{item.title}</Link></Menu.Item>
          ))
        } else if(item.children && item.hidden === false){
          // 查找一个与当前请求路径匹配的子Item
          const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0);
          // 如果存在, 说明当前item的子列表需要打开
          if (cItem) {
            this.openKey = item.key
          }
          // 向pre添加<SubMenu>
          pre.push((
              <SubMenu key={item.key} title={<span><Icon type={item.icon}/><span>{item.title}</span></span>}>
                {this.getMenuNodes(item.children)}
              </SubMenu>
          ));
        }
      return pre
    }, [])
  };

  /*
  在第一次render()之前执行一次
  为第一个render()准备数据(必须同步的)
   */
  componentWillMount () {
    this.menuNodes = this.getMenuNodes(menuConfig)
  };


  // 切换面板
  handlTabClick = () =>{
    const collapsed = !this.state.collapsed;
    // 更新状态
    this.setState({collapsed:collapsed})
  };



  render() {
    const user = memoryUtils.user;
    // 如果内存没有存储user ==> 当前没有登陆
    if(!user || !user.user) {
      // 自动跳转到登陆(在render()中)
      return <Redirect to='/login'/>
    }
    // 得到当前请求的路由路径
    let path = this.props.location.pathname;
    // 得到需要打开菜单项的key
    const openKey = this.openKey;
    // 读取状态
    const {collapsed} = this.state;
    console.log(this.props.location)
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
                <img src="https://saya.ac.cn/files/picture/logo/Pandora/20190602/2019060212877.png" /> {user.user}<Icon type="down" />
              </span>
            </Dropdown>
          </Col>
        </Row>
        <Row className="main">
          <aside className={collapsed?'menu-collapsed':'menu-expanded'}>
            <Menu selectedKeys={[path]} defaultOpenKeys={[openKey]} mode="inline"
                inlineCollapsed={collapsed} style={{ height: '100%' }}
                className={collapsed?'menu-collapsed':'menu-expanded'}>
              {
                this.menuNodes
              }
            </Menu>
          </aside>
          <section className='content-container'>
            <div className="grid-content bg-purple-light">
              <Col span={24} className="breadcrumb-container">
                <strong className="title">主页</strong>
                <Breadcrumb className="breadcrumb-inner">
                  <Breadcrumb.Item>Home</Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <a href="">Application Center</a>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <a href="">Application List</a>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>An Application</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              <Col span={24} className="content-wrapper">
                  <Switch>
                    <Route path='/backend/set/log' component={Log}/>
                    <Route path='/backend/api/db' component={DB}/>
                    {/*默认、及匹配不到时的页面*/}
                    <Redirect to='/backend/set/log'/>
                  </Switch>
              </Col>
            </div>
          </section>
        </Row>
      </div>
    );
  }
}

// 对外暴露
// 包装非路由组件传递一个新的组件
const LayoutBackend = withRouter(Admin);
export default LayoutBackend;