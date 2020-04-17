import React, {Component} from 'react';
import menuConfig from '../../../config/frontendMenuConfig'
import './index.less'
import {Redirect, Route, Switch, Link} from 'react-router-dom'
import {Menu, Row, Col} from "antd";
import FilesDownload from '../../frontend/files'
import NewsList from '../../frontend/news'
import NewsInfo from '../../frontend/newsInfo'
import NoteList from '../../frontend/note'
import NoteInfo from '../../frontend/noteInfo'
import Plan from '../../frontend/plan'
import Board from '../../frontend/board'
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-09-07 - 19:53
 * 描述：
 */
// 定义组件（ES6）
class Frontend extends Component {

    state = {

    }

    /*
     根据menu的数据数组生成对应的标签数组
     使用reduce() + 递归调用
     */
    getMenuNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push( <Menu.Item key={item.key}><Link to={item.key}>{item.title}</Link></Menu.Item>)
            return pre
        },[])
    }

    /*
    * 为第一次render()准备数据
    */
    componentWillMount() {
        let _this = this; //声明一个变量指向vue实例this,保证作用域一致
        _this.menuNodes = _this.getMenuNodes(menuConfig)
    };

    render() {
        return (
            <section className='frontend-container'>
                {/*顶部菜单开始*/}
                <div className='frontend-menu'>
                    <div className='frontend-menu-logo' style={{backgroundImage:`url('${process.env.PUBLIC_URL}/picture/svg/project.svg')`}}></div>
                    <Menu mode='horizontal'>
                        {
                            this.menuNodes
                        }
                    </Menu>
                </div>
                {/*顶部菜单结束*/}
                {/*页头区域开始*/}
                <header>
                    {/*网站欢迎部分开始*/}
                    <div className="banner" style={{backgroundImage:`url('${process.env.PUBLIC_URL}/picture/layout/banner.png')`}}>
                    </div>
                    {/*网站欢迎部分结束*/}
                </header>
                {/*页头区域结束*/}

                {/*主体部分开始*/}
                <section className="main-section">
                    <Switch>
                        <Route path='/pandora/files' component={FilesDownload}/>
                        <Route path='/pandora/news' component={NewsList}/>
                        <Route path='/pandora/note' component={NoteList}/>
                        <Route path='/pandora/newsInfo/:id' component={NewsInfo}/>
                        <Route path='/pandora/noteInfo/:id' component={NoteInfo}/>
                        <Route path='/pandora/plan' component={Plan}/>
                        <Route path='/pandora/board' component={Board}/>
                        <Route path='/pandora/me' component={NewsList}/>
                        {/*默认、及匹配不到时的页面*/}
                        <Redirect to='/'/>
                    </Switch>
                </section>
                {/*主体部分结束*/}

                {/*版权区域*/}
                <footer>
                    {/*版权区域图片*/}
                    <div className="copyright-img" style={{backgroundImage:`url('${process.env.PUBLIC_URL}/picture/layout/copyright.png')`}}></div>
                    {/*版权区域主体*/}
                    <div className="copyright-content">
                        <Row>
                            <Col xs={0} sm={0} md={8} xl={8} className='copyright-logo'>
                                <div style={{backgroundImage:`url('${process.env.PUBLIC_URL}/picture/svg/project.svg')`}}></div>
                            </Col>
                            <Col xs={12} sm={12} md={8} xl={8}>
                                <p>
                                    Copyright &copy; 2016-{(new Date()).getFullYear() } Saya.ac.cn-暖心阁 All rights reserved<br/>
                                    国家工信部域名备案信息：[Saya.ac.cn/蜀ICP备19027394号]<br/>
                                    saya@Saya.ac.cn
                                </p>
                            </Col>
                            <Col xs={12} sm={12} md={8} xl={8}>
                                <p>
                                    地址：四川省成都市金牛区兴平路100号<br/>
                                    邮编：610036<br/>
                                    {/*<a href="/pandora/board">网站建议</a>*/}
                                </p>
                            </Col>
                        </Row>
                    </div>
                </footer>
            </section>
        );
    }
}

// 对外暴露
export default Frontend;