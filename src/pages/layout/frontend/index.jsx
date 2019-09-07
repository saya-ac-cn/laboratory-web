import React, {Component} from 'react';
import menuConfig from '../../../config/frontendMenuConfig'
import './index.less'
import './index.css'
import {Link} from 'react-router-dom'
import {Col,Menu} from "antd";
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-09-07 - 19:53
 * 描述：
 */
const {SubMenu} = Menu;
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
                    <div className='frontend-menu-logo' style={{backgroundImage:'url('+process.env.PUBLIC_URL+"/picture/svg/project.svg"+')'}}></div>
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
                    <div className="banner" style={{backgroundImage:'url('+process.env.PUBLIC_URL+"/picture/layout/banner.png"+')'}}>
                    </div>
                    {/*网站欢迎部分结束*/}
                </header>
                {/*页头区域结束*/}

                {/*主体部分开始*/}
                <section className="main-section">
8008989
                </section>
                {/*主体部分结束*/}

                {/*版权区域*/}
                <footer>
                    {/*版权区域图片*/}
                    <div className="copyright-img" style={{backgroundImage:'url('+process.env.PUBLIC_URL+"/picture/layout/copyright.png"+')'}}></div>
                    {/*版权区域主体*/}
                    <div className="copyright-content">
                        2
                    </div>
                </footer>

            </section>
        );
    }
}

// 对外暴露
export default Frontend;