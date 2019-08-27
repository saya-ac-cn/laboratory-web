import React, {Component} from 'react';
import './index.less'
import {Redirect, Route, Switch, Link, withRouter} from 'react-router-dom'
import {Row, Col, Icon, Menu, Dropdown, Breadcrumb, Modal} from 'antd';
import {requestLogout} from '../../../api'
import menuConfig from '../../../config/backendMenuConfig'
import memoryUtils from '../../../utils/memoryUtils'
import storageUtils from '../../../utils/storageUtils'
import Info from '../../backend/info'
import Log from '../../backend/log'
import DB from '../../backend/db'
import Api from '../../backend/api'
import News from '../../backend/news'
import Notes from '../../backend/notes'
import GuestBook from '../../backend/guestbook'
import FilesMana from '../../backend/file'
import Lllustration from '../../backend/illustration'
import Wallpaper from '../../backend/wallpaper'
import Plan from '../../backend/plan'
import NoteBook from '../../backend/notebook'
import Transaction from '../../backend/financial/transaction'
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-07-07 - 10:12
 * 描述：后台页面布局
 */
const {SubMenu} = Menu;

// 定义组件（ES6）
class Admin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            openKeys: [],
        };
    }

    getHeaderMenu = () => (
        <Menu>
            <Menu.Item key="1"><Link to='/backstage/set/info'>我的信息</Link></Menu.Item>
            <Menu.Item key="2">设置</Menu.Item>
            <Menu.Item key="3" onClick={this.logout}>退出</Menu.Item>
        </Menu>
    );

    /*
     根据menu的数据数组生成对应的标签数组
     使用reduce() + 递归调用
     */
    getMenuNodes = (menuList) => {
        // 得到当前请求的路由路径
        const path = this.props.location.pathname;
        return menuList.reduce((pre, item) => {
            // 向pre添加<Menu.Item>
            if (!item.children && item.hidden === false) {
                pre.push((
                    <Menu.Item key={item.key}><Link to={item.key}>{item.title}</Link></Menu.Item>
                ))
            } else if (item.children && item.hidden === false) {
                // 查找一个与当前请求路径匹配的子Item
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0);
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


    // 切换面板
    handlTabClick = () => {
        const collapsed = !this.state.collapsed;
        // 更新状态
        this.setState({collapsed: collapsed})
    };

    /**
     * 提取当前页面的标题
     **/
    getTitle = () => {
        // 得到当前请求路径
        const path = this.props.location.pathname;
        let titles = {title: [], local: ''};
        menuConfig.forEach(item => {
            if (item.key === path) { // 如果当前item对象的key与path一样,item的title就是需要显示的title
                titles.title.push((<Breadcrumb.Item key={item.key}>{item.title}</Breadcrumb.Item>));
                titles.local = item.title
            } else if (item.children) {
                // 在所有子item中查找匹配的
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0);
                // 如果有值才说明有匹配的
                if (cItem) {
                    // 取出它的一级和二级title
                    titles.title.push((<Breadcrumb.Item key={item.key}>{item.title}</Breadcrumb.Item>));
                    titles.title.push((<Breadcrumb.Item key={cItem.key}>{cItem.title}</Breadcrumb.Item>));
                    titles.local = cItem.title
                }
            }
        });
        return titles
    };

    /*
    退出登陆
     */
    logout = () => {
        // 显示确认框
        Modal.confirm({
            title: '确定退出吗?',
            onOk: async () => {
                // 请求注销接口
                await requestLogout();
                // 删除保存的user数据
                storageUtils.removeUser();
                memoryUtils.user = {};
                // 跳转到login
                this.props.history.replace('/login')
            }
        })
    };


    /*
    *在第一次render()之前执行一次
    * 为第一个render()准备数据(必须同步的)
    */
    componentWillMount() {
        // 初始化左侧导航
        this.menuNodes = this.getMenuNodes(menuConfig);
        // 初始化顶部导航
        this.headerMenu = this.getHeaderMenu;
    };

    render() {
        const user = memoryUtils.user;
        // 如果内存没有存储user ==> 当前没有登陆
        if (!user || !user.user) {
            // 自动跳转到登陆(在render()中)
            return <Redirect to='/login'/>
        }
        // 得到当前请求的路由路径
        let path = this.props.location.pathname;
        if (path.indexOf('/backstage/message/news') === 0){
            // 当前请求的是news及其下面的路由
            path = '/backstage/message/news'
        }
        // 得到需要打开菜单项的key
        const openKey = this.openKey;
        // 读取状态
        const {collapsed} = this.state;
        // 得到当前需要显示的title
        const {title, local} = this.getTitle();
        return (
            <div className="container">
                <Row className="header">
                    <Col className={`logo ${collapsed ? 'logo-collapse-width' : 'logo-width'}`} span={10}>
                        {collapsed ? '' : '云·实验室中心'}
                    </Col>
                    <Col span={10}>
                        <div className="tools" onClick={this.handlTabClick}>
                            <Icon type="appstore"/>
                        </div>
                    </Col>
                    <Col className="userinfo" span={4}>
                        <Dropdown overlay={this.headerMenu}>
              <span className="el-dropdown-link userinfo-inner">
                <img src={user.logo} alt="logo"/> {user.user}<Icon type="down"/>
              </span>
                        </Dropdown>
                    </Col>
                </Row>
                <Row className="main">
                    <aside className={collapsed ? 'menu-collapsed' : 'menu-expanded'}>
                        <Menu selectedKeys={[path]} defaultOpenKeys={[openKey]} mode="inline"
                              inlineCollapsed={collapsed} style={{height: '100%'}}
                              className={collapsed ? 'menu-collapsed' : 'menu-expanded'}>
                            {
                                this.menuNodes
                            }
                        </Menu>
                    </aside>
                    <section className='content-container'>
                        <div className="grid-content bg-purple-light">
                            <Col span={24} className="breadcrumb-container">
                                <strong className="title">{local}</strong>
                                <Breadcrumb className="breadcrumb-inner">
                                    <Breadcrumb.Item>所在位置</Breadcrumb.Item>
                                    {
                                        title
                                    }
                                </Breadcrumb>
                            </Col>
                            <Col span={24} className="content-wrapper">
                                <Switch>
                                    <Route path='/backstage/set/info' component={Info}/>
                                    <Route path='/backstage/set/log' component={Log}/>
                                    <Route path='/backstage/api/mana' component={Api}/>
                                    <Route path='/backstage/api/db' component={DB}/>
                                    <Route path='/backstage/oss/wallpaper' component={Wallpaper}/>
                                    <Route path='/backstage/oss/illustration' component={Lllustration}/>
                                    <Route path='/backstage/oss/files' component={FilesMana}/>
                                    <Route path='/backstage/message/news' component={News}/>
                                    <Route path='/backstage/message/guestbook' component={GuestBook}/>
                                    <Route path='/backstage/financial/transaction' component={Transaction}/>
                                    <Route path='/backstage/grow/plan' component={Plan}/>
                                    <Route path='/backstage/grow/notebook' component={NoteBook}/>
                                    <Route path='/backstage/grow/notes' component={Notes}/>
                                    {/*默认、及匹配不到时的页面*/}
                                    <Redirect to='/backstage/set/info'/>
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