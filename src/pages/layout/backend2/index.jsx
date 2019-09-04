import React, {Component} from 'react';
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
        super(props)
    }


    render() {
        return (
            <div className="this-container">
                <div className='background-div'>
                    <img style={{backgroundImage:'url('+process.env.PUBLIC_URL+"/picture/login/login_background2.jpg"+')'}}/>
                </div>
                <header className="this-header">头部</header>
                <section className="this-content">
                    <div className='leftmunu-open'></div>
                    <div className='content-container'></div>
                </section>
                <footer className="this-footer"></footer>
            </div>
        );
    }
}

// 对外暴露
export default Admin;