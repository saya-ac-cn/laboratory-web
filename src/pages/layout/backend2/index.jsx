import React, {Component} from 'react';
import {Input, Button, Icon, Menu, Popover, Avatar, Breadcrumb, Badge, Modal} from 'antd';
import {Redirect, Route, Switch, Link, withRouter} from 'react-router-dom'
import './index.less'
import menuConfig from '../../../config/backendMenuConfig'
import memoryUtils from "../../../utils/memoryUtils";
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
import Transaction from '../../backend/transaction'
import FinancialForDay from '../../backend/financialforday'
import FinancialForMonth from '../../backend/financialformonth'
import FinancialForYear from '../../backend/financialforyear'
import DashBoard from '../../backend/dashboard'
import {requestLogout} from "../../../api";
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-09-04 - 22:15
 * 描述：管理页面
 */
const {SubMenu} = Menu;
// 定义组件（ES6）
class Admin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            searchfocus: false,
            searchValue: null
        };
    }

    // 切换面板
    handlTabClick = () => {
        const collapsed = !this.state.collapsed;
        // 更新状态
        this.setState({collapsed: collapsed})
    };


    /**
     * 失去焦点
     */
    inputOnBlur = () => {
        this.setState({
            searchfocus: false
        })
    }


    /**
     * 获得焦点
     */
    inputOnFocus = () =>{
        this.setState({
            searchfocus: true
        })
    }

    /**
     * 初始化头像下拉菜单
     */
    initHeaderMenu = () => (
        <div className="backend-layout-header-info-hover">
            <div className='user-img-div'>
                <Avatar size={64} icon="user" src={this.userCatche.user.logo}/>
                <div className='operator-img'>
                    <span>{this.userCatche.user.user}</span>
                    <Link to='/backstage/set/info'>更换头像</Link>
                </div>
            </div>
            <div className='system-operator'>
                <Button type="link" href='/backstage/set/info'>设置</Button>
                <Button type="link" onClick={this.logout}>退出</Button>
            </div>
        </div>
    )

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
            title: '操作确认',
            content:'确定退出吗?',
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

    /**
     * 搜索框内容改变事件（用于双向绑定数据）
     * @param event
     */
    searchInputChange = (event) => {
        let _this = this;
        const value = event.target.value
        _this.setState({
            searchValue: value
        })
    };

    /**
     * 执行搜索
     */
    handleSearch = () =>{
        let _this = this;
        let searchValue = _this.state.searchValue || ""
        searchValue = searchValue.trim()
        if (!!searchValue) {
            // 有效内容可以搜索
            // 跳转到笔记列表界面 (需要再回退到当前页面),replace是不需要回退
            this.props.history.push(`/backstage/grow/notes?search=${searchValue}`)
        }
    }

    /**
     * 写笔记
     */
    addNotes = () => {
        // 跳转到笔记列表界面 (需要再回退到当前页面),replace是不需要回退
        this.props.history.push('/backstage/grow/notes/create')
    }

    /**
     * 判断对象是否为空
     * @param data
     * @returns {boolean}
     */
    isEmptyObject = (data) => {
        // 手写实现的判断一个对象{}是否为空对象，没有任何属性 非空返回false
        var item;
        for (item in data)
            return false;
        return true;
    }

    /*
    * 在第一次render()之前执行一次
    * 为第一个render()准备数据(必须同步的)
    */
    componentWillMount() {
        this.userCatche = memoryUtils.user || {};
        // 初始化左侧导航
        this.menuNodes = this.getMenuNodes(menuConfig);
        // 顶部用户头像下拉
        this.headerUserInfo = this.initHeaderMenu()
    }

    render() {
        const user = memoryUtils.user;
        // 如果内存没有存储user ==> 当前没有登陆
        if (!user || !user.user) {
            // 自动跳转到登陆(在render()中)
            return <Redirect to='/login'/>
        }
        // 读取状态
        const {collapsed, searchfocus, searchValue} = this.state;
        // 得到当前请求的路由路径
        let path = this.props.location.pathname;
        if (path.indexOf('/backstage/message/news') === 0){
            // 当前请求的是news及其下面的路由
            path = '/backstage/message/news'
        }
        if (path.indexOf('/backstage/grow/notes') === 0){
            // 当前请求的是news及其下面的路由
            path = '/backstage/grow/notes'
        }
        // 得到需要打开菜单项的key
        const openKey = this.openKey;
        // 得到当前需要显示的title
        const {title, local} = this.getTitle();
        return (
            <div className="backend-container">
                <div className='background-div' style={{backgroundImage:`url('${process.env.PUBLIC_URL}/picture/backend/admin_background1.jpg')`}}>
                </div>
                <header className="this-header">
                    <div className='header-logo'>
                        <div className='tab-operation'>
                            <Button type="link" size='large' onClick={this.handlTabClick}>
                                <Icon type='menu'/>
                            </Button>
                        </div>
                        <div className='project-div' style={{backgroundImage:`url('${process.env.PUBLIC_URL}/picture/svg/project.svg')`}}>
                        </div>
                        <div className='project-name'>
                            Lab
                        </div>
                    </div>
                    <div className='header-search'>
                        <div className='header-search-form'>
                            <div className='header-search-form-input' style={{background:searchfocus?'#fff':'rgba(241,243,244,0.24)'}}>
                                <Button onClick={this.handleSearch}><Icon type="search"/></Button>
                                <Input placeholder="搜索笔记"
                                       value={searchValue}
                                       onChange={this.searchInputChange}
                                       onPressEnter={this.handleSearch}
                                       onBlur={this.inputOnBlur }
                                       onFocus={this.inputOnFocus }/>
                            </div>
                        </div>
                        <div className='header-search-menu'>
                            {
                                !(this.isEmptyObject(user.plan)) ?
                                    <Popover content={user.plan.reduce((pre, item) => {pre.push(<p key={item.id}>{item.describe}</p>);return pre},[])} title="今天计划">
                                        <Badge count={user.plan.length} dot color="#2db7f5">
                                            <Icon type="notification" />
                                        </Badge>
                                    </Popover> :
                                    <Popover content="暂无计划" title="今天计划">
                                        <Badge count={0} dot>
                                            <Icon type="notification" />
                                        </Badge>
                                    </Popover>
                            }
                        </div>
                    </div>
                    <div className='header-info'>
                        <Popover trigger="hover" mouseEnterDelay={0.2} mouseLeaveDelay={0.4} content={this.headerUserInfo}  placement="bottomRight">
                            <span className="el-dropdown-link">
                                <img src={user.user.logo} alt={user.user.user}/>
                            </span>
                        </Popover>
                    </div>
                </header>
                <section className="this-content">
                    <div className={`leftmunu ${collapsed ? 'leftmunu-close' : 'leftmunu-open'}`}>
                        <div className='menu-logo'>
                            <div className={`logo-item ${collapsed?"menu-logo-close":null}`} onClick={this.addNotes}>
                                写笔记
                            </div>
                        </div>
                        <div className='menu-list'>
                            <Menu className='menu-list-ul' selectedKeys={[path]} defaultOpenKeys={[openKey]} mode="inline"
                                  inlineCollapsed={collapsed}>
                                {
                                    this.menuNodes
                                }
                            </Menu>
                        </div>
                        <div className={`menu-copyright ${collapsed?"menu-copyright-close":null}`}>
                            <Button type="link" title='切换壁纸'><Icon type="switcher"/></Button>
                            <Button type="link" title='数据监控' href="/backstage/set/dashBoard"><Icon type="stock"/></Button>
                            <Button type="link" title='网站留言' href="/backstage/message/guestbook"><Icon type="message"/></Button>
                        </div>
                    </div>
                    <div className='content-container'>
                        <div className='pagename-div'>
                            <div className='pagename-label'>
                                <strong>{local}</strong>
                                <Breadcrumb className="breadcrumb-inner">
                                    <Breadcrumb.Item>所在位置</Breadcrumb.Item>
                                    {
                                        title
                                    }
                                </Breadcrumb>
                            </div>
                        </div>
                        <div className='content-div'>
                            <div className='container-div'>
                                <Switch>
                                    <Route path='/backstage/set/info' component={Info}/>
                                    <Route path='/backstage/set/log' component={Log}/>
                                    <Route path='/backstage/set/dashBoard' component={DashBoard}/>
                                    <Route path='/backstage/api/mana' component={Api}/>
                                    <Route path='/backstage/api/db' component={DB}/>
                                    <Route path='/backstage/oss/wallpaper' component={Wallpaper}/>
                                    <Route path='/backstage/oss/illustration' component={Lllustration}/>
                                    <Route path='/backstage/oss/files' component={FilesMana}/>
                                    <Route path='/backstage/message/news' component={News}/>
                                    <Route path='/backstage/message/guestbook' component={GuestBook}/>
                                    <Route path='/backstage/financial/transaction' component={Transaction}/>
                                    <Route path='/backstage/financial/financialForDay' component={FinancialForDay}/>
                                    <Route path='/backstage/financial/financialForMonth' component={FinancialForMonth}/>
                                    <Route path='/backstage/financial/financialForYear' component={FinancialForYear}/>
                                    <Route path='/backstage/grow/plan' component={Plan}/>
                                    <Route path='/backstage/grow/notebook' component={NoteBook}/>
                                    <Route path='/backstage/grow/notes' component={Notes}/>
                                    {/*默认、及匹配不到时的页面*/}
                                    <Redirect to='/backstage/set/info'/>
                                </Switch>
                            </div>
                            <div className='operation-info'>
                                {
                                    !(this.isEmptyObject(user.log)) ?
                                        <span>{`您上次操作时间:${user.log.date},操作地点:${user.log.city}(${user.log.ip}),操作明细:${user.log.logType.describe}`}</span> :
                                        <span>Hi，这是您第一次使用吧？如有需要帮助的请及时联系运营团队。</span>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='quick-div'>
                        <Button type="link" title='流水申报' href="/backstage/financial/transaction"><Icon type="money-collect"/></Button>
                        <Button type="link" title='发布动态' href="/backstage/message/news/publish"><Icon type="notification"/></Button>
                        <Button type="link" title='安排计划' href="/backstage/grow/plan"><Icon type="carry-out"/></Button>
                        <Button type="link" title='便利贴' href="/backstage/grow/plan"><Icon type="pushpin"/></Button>
                    </div>
                </section>
            </div>
        );
    }
}

// 对外暴露
const LayoutBackend = withRouter(Admin);
export default LayoutBackend;