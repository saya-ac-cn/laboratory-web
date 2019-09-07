import React, {Component} from 'react';
import {Input, Button, Icon, Dropdown, Menu, Col} from 'antd';
import './index.less'
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-09-04 - 22:15
 * 描述：管理页面
 */
const menu = (
    <Menu>
        <Menu.Item key="0">
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                1st menu item
            </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="1">
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                2nd menu item
            </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3">
            3rd menu item（disabled）
        </Menu.Item>
    </Menu>
);
// 定义组件（ES6）
class Admin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            searchfocus: false,
        };
    }

    // 切换面板
    handlTabClick = () => {
        const collapsed = !this.state.collapsed;
        // 更新状态
        this.setState({collapsed: collapsed})
    };

    /**
     * 执行搜索
     */
    handleSearch = () =>{
        console.log("handleSearch")
    }


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

    render() {
        // 读取状态
        const {collapsed, searchfocus} = this.state;
        return (
            <div className="backend-container">
                <div className='background-div' style={{backgroundImage:'url('+process.env.PUBLIC_URL+"/picture/backend/admin_background1.jpg"+')'}}>
                </div>
                <header className="this-header">
                    <div className='header-logo'>
                        <div className='tab-operation'>
                            <Button type="link" size='large' onClick={this.handlTabClick}>
                                <Icon type='menu'/>
                            </Button>
                        </div>
                        <div className='project-div' style={{backgroundImage:'url('+process.env.PUBLIC_URL+"/picture/svg/project.svg"+')'}}>
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
                                       onPressEnter={this.handleSearch}
                                       onBlur={this.inputOnBlur }
                                       onFocus={this.inputOnFocus }/>
                            </div>
                        </div>
                        <div className='header-search-menu'>
                            <Dropdown overlay={menu}>
                                <Icon type="appstore" />
                            </Dropdown>
                        </div>
                    </div>
                    <div className='header-info'>
                        <Dropdown overlay={menu}>
                          <span className="el-dropdown-link userinfo-inner">
                            <img src='https://saya.ac.cn/files/picture/logo/Pandora/20190715/2019071598184.png' alt="logo"/>
                          </span>
                        </Dropdown>
                    </div>
                </header>
                <section className="this-content">
                    <div className={`leftmunu ${collapsed ? 'leftmunu-close' : 'leftmunu-open'}`}>
                        <div className='menu-logo'>
                            <div className={`logo-item ${collapsed?"menu-logo-close":null}`}>
                                写笔记
                            </div>
                        </div>
                        <div className='menu-list'>菜单列表</div>
                        <div className={`menu-copyright ${collapsed?"menu-copyright-close":null}`}>版权</div>
                    </div>
                    <div className='content-container'>
                        <div className='pagename-div'>
                            <div className='pagename-label'>页面路径:用户中心/修改密码</div>
                        </div>
                        <div className='content-div'>
                            <div className='container-div'>
                                无数据
                            </div>
                            <div className='operation-info'>上次操作明细</div>
                        </div>
                    </div>
                    <div className='quick-div'>2</div>
                </section>
            </div>
        );
    }
}

// 对外暴露
export default Admin;