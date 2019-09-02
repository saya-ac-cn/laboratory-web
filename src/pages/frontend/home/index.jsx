import React, { Component } from 'react';
import DocumentTitle from 'react-document-title'
import {Col, Row, Carousel, Input, Button} from "antd";
import './index.less'
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-09-02 - 20:46
 * 描述：主页
 */
// 定义组件（ES6）
class Home extends Component {



  render() {
    return (
      <DocumentTitle title="saya.ac.cn-首页">
          <div className="this-container">
              <Carousel autoplay={true} dots={false} className="background">
                  <div><img className="img-item" style={{backgroundImage:'url('+process.env.PUBLIC_URL+"/picture/login/login_background1.jpg"+')'}}/></div>
                  <div><img className="img-item" style={{backgroundImage:'url('+process.env.PUBLIC_URL+"/picture/login/login_background2.jpg"+')'}}/></div>
                  <div><img className="img-item" style={{backgroundImage:'url('+process.env.PUBLIC_URL+"/picture/login/login_background3.jpg"+')'}}/></div>
                  <div><img className="img-item" style={{backgroundImage:'url('+process.env.PUBLIC_URL+"/picture/login/login_background4.jpg"+')'}}/></div>
                  <div><img className="img-item" style={{backgroundImage:'url('+process.env.PUBLIC_URL+"/picture/login/login_background5.jpg"+')'}}/></div>
              </Carousel>
              <header className="this-header">
                  <Col span={19} offset={1} className="header-center">
                      <ul>
                          <li><a href='#'>网站首页</a></li>
                          <li><a href='#'>关于个人</a></li>
                          <li><a href='#'>消息动态</a></li>
                          <li><a href='#'>文档下载</a></li>
                          <li><a href='#'>随笔记录</a></li>
                          <li><a href='#'>计划安排</a></li>
                          <li><a href='#'>留言反馈</a></li>
                      </ul>
                  </Col>
                  <Col span={3} offset={1} style={{color:'#dbdbdb'}} className="header-center">
                      2019-1-1
                  </Col>
              </header>
              <section className="this-main">
                  <Row gutter={20} className="search-block">
                      <Col span={20} offset={2}  className="search-div">
                          <div className="search-line1">
                              <div className="search-div-tag1">全网搜</div>
                              <div className="search-div-tag2"></div>
                          </div>
                          <div className="search-line2">
                              <Input className="inline-input search-input" placeholder="请输入内容"/>
                              <Button className="search-button" ></Button>
                          </div>
                      </Col>
                  </Row>
              </section>
              <footer className="this-copright">
                  <Row gutter={20} style={{width: '100%'}}>
                      <Col span={20} offset={2}>
                          Copyright &copy; 2016-2019 &nbsp; Saya.ac.cn-暖心阁 版权所有<br/>国家工信部域名备案信息：蜀ICP备16013222号
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