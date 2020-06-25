import React, {Component} from 'react';
import DocumentTitle from 'react-document-title'
import frontendMenuListV1 from '../../../config/frontendMenuConfig'
import {Col, Row, Carousel, Icon, Button, AutoComplete} from "antd";
import {baiduSearchSelect,baiduSearchWord} from '../../../api'
import './index.less'
import jsonp from 'jsonp'

/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-09-02 - 20:46
 * 描述：主页
 */

// 定义组件（ES6）
class Home extends Component {

    state = {
        copyrightDate: new Date().getFullYear(),
        value: '',
        dataSource: [],
    };

    //封装jonsp为promise对象
    reqBaiduSearchSelect = (keyword,opts={}) => {
        return new Promise((resolve,reject)=>{
            jsonp(`${baiduSearchSelect}?wd=${keyword}`,opts, (err,data)=> {
                if (err) reject(err);
                resolve(data);
            })
        })
    }

    /**
     * 搜索补全项的时候调用
     * @param searchText
     */
    onSearch = async (searchText) => {
        if (!!searchText){
            let {s} = await this.reqBaiduSearchSelect(searchText,{param:"cb"});
            this.setState({
                dataSource: !s ? [] : s
            });
        }else {
            this.setState({
                dataSource: []
            });
        }
    };

    /**
     * 选中 option，或 input 的 value 变化时，调用此函数
     * @param value
     */
    onChange = value => {
        this.setState({value});
    };

    /**
     * 选择下拉选项
     * @param value
     */
    onSelect = value =>{
        window.open('about:blank').location.href = baiduSearchWord + '?wd=' + value
    }

    /**
     * 单击搜索
     */
    goSearch = () => {
        window.open('about:blank').location.href = baiduSearchWord + '?wd=' + this.state.value
    }

    /*
     根据menu的数据数组生成对应的标签数组
     使用reduce() + 递归调用
     */
    getMenuNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push(<li key={item.key}><a href={item.key}>{item.title}</a></li>)
            return pre
        },[])
    }


    /*
    * 为第一次render()准备数据
    */
    componentWillMount() {
        let _this = this; //声明一个变量指向vue实例this,保证作用域一致
        _this.menuNodes = _this.getMenuNodes(frontendMenuListV1)
    };


    render() {
        const {dataSource, copyrightDate} = this.state;
        return (
            <DocumentTitle title="Saya.ac.cn-首页">
                <div className="this-container">
                    <Carousel autoplay={true} dots={false} className="background">
                        <div><div className="img-item" style={{backgroundImage:`url('${process.env.PUBLIC_URL}/picture/login/login_background1.jpg')`}}></div></div>
                        <div><div className="img-item" style={{backgroundImage:`url('${process.env.PUBLIC_URL}/picture/login/login_background2.jpg')`}}></div></div>
                        <div><div className="img-item" style={{backgroundImage:`url('${process.env.PUBLIC_URL}/picture/login/login_background3.jpg')`}}></div></div>
                        <div><div className="img-item" style={{backgroundImage:`url('${process.env.PUBLIC_URL}/picture/login/login_background4.jpg')`}}></div></div>
                        <div><div className="img-item" style={{backgroundImage:`url('${process.env.PUBLIC_URL}/picture/login/login_background5.jpg')`}}></div></div>
                    </Carousel>
                    <header className="this-header">
                        <Col span={19} offset={1} className="header-center">
                            <ul>
                                {
                                    this.menuNodes
                                }
                            </ul>
                        </Col>
                        <Col span={3} offset={1} style={{color:'#dbdbdb'}} className="header-center">

                        </Col>
                    </header>
                    <section className="this-main">
                        <Row gutter={20} className="search-block">
                            <Col span={20} offset={2} className="search-div">
                                <div className="search-line1">
                                    <div className="search-div-tag1">搜一下</div>
                                    <div className="search-div-tag2"></div>
                                </div>
                                <div className="search-line2">
                                    <AutoComplete
                                        className='search-input'
                                        onChange={this.onChange}
                                        dataSource={dataSource}
                                        onSearch={this.onSearch}
                                        onSelect={this.onSelect}
                                        placeholder="请输入内容"
                                    />
                                    <Button className="search-button" onClick={this.goSearch}><Icon type="search"/></Button>
                                </div>
                            </Col>
                        </Row>
                    </section>
                    <footer className="this-copright">
                        <Row gutter={20} style={{width: '100%'}}>
                            <Col span={20} offset={2}>
                                Copyright &copy; 2016-{copyrightDate} &nbsp; Saya.ac.cn-暖心阁 版权所有<br/>国家工信部域名备案信息：蜀ICP备19027394号
                            </Col>
                        </Row>
                    </footer>
                </div>
            </DocumentTitle>
        );
    }
}

// 对外暴露
export default Home;
