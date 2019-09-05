import React, {Component} from 'react';
import { Button,Icon } from 'antd';
import './index.less'
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-09-04 - 22:15
 * 描述：管理页面
 */

// 定义组件（ES6）
class Admin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
        };
    }

    // 切换面板
    handlTabClick = () => {
        const collapsed = !this.state.collapsed;
        // 更新状态
        this.setState({collapsed: collapsed})
    };

    render() {
        // 读取状态
        const {collapsed} = this.state;
        return (
            <div className="this-container">
                <div className='background-div' style={{backgroundImage:'url('+process.env.PUBLIC_URL+"/picture/backend/admin_background1.jpg"+')'}}>
                </div>
                <header className="this-header">
                    <div className='header-logo'>
                        <Button type="link" ghost onClick={this.handlTabClick}>
                            <Icon type='menu'/>
                        </Button>
                    </div>
                    <div className='header-search'>搜索</div>
                    <div className='header-info'>退出</div>
                </header>
                <section className="this-content">
                    <div className={`leftmunu ${collapsed ? 'leftmunu-close' : 'leftmunu-open'}`}>
                        <div className='menu-logo'>快速入口</div>
                        <div className='menu-list'>菜单列表</div>
                        <div className='menu-copyright'>版权</div>
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