import React, {Component} from 'react';
import DocumentTitle from "react-document-title";
import './index.less'
import {StyleSheet, css} from 'aphrodite';
import {swap, slideDownReturn,swashIn,puffIn,spaceInDown} from 'react-magic';

/*
 * 文件名：index.jsx
 * 作者：saya
 * 创建日期：2020/6/19 - 9:46 下午
 * 描述：
 */
const styles = StyleSheet.create({
  magic: {
    animationName: swap,
    animationDuration: '2s'
  },
  slide: {
    animationName: slideDownReturn,
    animationDuration: '2s'
  },
  math:{
    animationName:swashIn,
    animationDuration: '3s'
  },
  bling:{
    animationName: puffIn,
    animationDuration: '2s'
  },
  spaceInDown:{
    animationName: spaceInDown,
    animationDuration: '2s'
  },
});

// 定义组件（ES6）
class Home extends Component {

  constructor(props) {
    super(props)
  }


  render() {
    return (
      <DocumentTitle title="Saya.ac.cn-首页">
        <div className="frontend2-home-root">
          <header></header>
          <section>
            <div>
              <div className={`frontend2-home-hi ${css(styles.magic)}`}>
                <div className="frontend2-home-hi-symbol">
                  <hr/>
                  <i/>
                  <div>A New Day</div>
                </div>
                <div className="frontend2-home-hi-motto">将来你会明白，所谓的光辉岁月,并不是后来闪耀的日子，而是无人问津时,你对梦想的偏执，对梦想的执着，加油！</div>
              </div>
              <div className={`frontend2-home-calendar ${css(styles.magic)}`}>November 15</div>
              <div className="frontend2-home-menu">
                <div className={`frontend2-home-menu-circle ${css(styles.bling)}`}
                     style={{backgroundImage: `url('${process.env.PUBLIC_URL}/picture/svg/circle.svg')`}}>Home
                </div>
                <div className={`frontend2-home-menu-circle ${css(styles.bling)}`}
                     style={{backgroundImage: `url('${process.env.PUBLIC_URL}/picture/svg/circle.svg')`}}>关于个人
                </div>
                <div className={`frontend2-home-menu-circle ${css(styles.bling)}`}
                     style={{backgroundImage: `url('${process.env.PUBLIC_URL}/picture/svg/circle.svg')`}}>个人动态
                </div>
                <div className={`frontend2-home-menu-border ${css(styles.math)}`}></div>
                <div className={`frontend2-home-menu-circle ${css(styles.bling)}`}
                     style={{backgroundImage: `url('${process.env.PUBLIC_URL}/picture/svg/circle.svg')`}}>随笔记录
                </div>
                <div className={`frontend2-home-menu-circle ${css(styles.bling)}`}
                     style={{backgroundImage: `url('${process.env.PUBLIC_URL}/picture/svg/circle.svg')`}}>文档下载
                </div>
                <div className={`frontend2-home-menu-circle ${css(styles.bling)}`}
                     style={{backgroundImage: `url('${process.env.PUBLIC_URL}/picture/svg/circle.svg')`}}>计划安排
                </div>
                <div className={`frontend2-home-menu-circle ${css(styles.bling)}`}
                     style={{backgroundImage: `url('${process.env.PUBLIC_URL}/picture/svg/circle.svg')`}}>数据接口
                </div>
              </div>
              <div className={`frontend2-home-memo-news ${css(styles.spaceInDown)}`}>
                <div className="frontend2-home-memo-newsdiv">刘能凯2019年度研发&技术总结</div>
                <div className="frontend2-home-memodiv-news">Spring及Spring MVC统一异常处理</div>
              </div>
              <div className={`frontend2-home-logo ${css(styles.bling)}`} style={{backgroundImage:`url('${process.env.PUBLIC_URL}/picture/svg/project-border.svg')`}}></div>
            </div>

          </section>
          <footer className={css(styles.slide)}>
            <div className="trapezoid">
            </div>
            <div className="copyright-text">Copyright © 2016-2020 Saya.ac.cn-暖心阁 版权所有 国家工信部域名备案信息：蜀ICP备19027394号</div>
          </footer>
        </div>
      </DocumentTitle>
    );
  }
}

// 对外暴露
export default Home;
