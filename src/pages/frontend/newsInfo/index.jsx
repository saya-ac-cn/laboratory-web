import React, {Component} from 'react';
import DocumentTitle from 'react-document-title'
import './index.less'
import {queryNewsInfo} from "../../../api";
import {openNotificationWithIcon_} from "../../../utils/window";
import {Spin, Tag} from "antd";
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-09-09 - 21:08
 * 描述：动态详情
 */

// 定义组件（ES6）
class NewsInfo extends Component {

    state = {
        datas: null,
        // 动态编号
        id: null,
        listLoading: false,
        tagColor: ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'],
    }

    /**
     * 获取动态详情数据
     * @returns {Promise<void>}
     */
    initDatas = async () => {
        let para = {
            id: this.state.id
        };
        let thisData = {}
        // 发异步ajax请求, 获取数据
        // 在发请求前, 显示loading
        this.setState({listLoading: true});
        const {msg, code, data} = await queryNewsInfo(para);
        // 在请求完成后, 隐藏loading
        this.setState({listLoading: false});
        if (code === 0) {
            var thisNews = data.now;
            thisData = data
            thisData.now.topic = thisNews.topic
            thisData.now.label = thisNews.label === null ? [] : (thisNews.label).split(';')
            thisData.now.content = thisNews.content
            this.setState({
                datas: thisData
            });
        } else {
            openNotificationWithIcon_("error", "错误提示", msg);
        }
    };

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
    };

    forMap = tag => {
        let colors = this.state.tagColor;
        const tagElem = (
            <Tag
                color={colors[Math.floor(Math.random()*10)]}>
                {tag}
            </Tag>
        );
        return (<span key={tag} style={{ display: 'inline-block' }}>{tagElem}</span>
        );
    };

    /**
     * 初始化页面配置信息
     */
    componentWillMount() {
        let _this = this
        let id = _this.props.match.params.id
        if (!!id) {
            _this.setState({id}, function () {
                _this.initDatas()
            })
        }
    }


    render() {
        // 读取状态数据
        const {datas, listLoading} = this.state;
        let title = '动态详情'
        let tagChild = []
        if (!(this.isEmptyObject(datas))){
            if (!(this.isEmptyObject(datas.now))) {
                title = datas.now.topic
                 tagChild = datas.now.label.map(this.forMap);
            }
        }
        return (
            <DocumentTitle title={`saya.ac.cn-${title}`}>
                <div className="base-content">
                    <div className="child-container">
                        <div className="menu-title">
                            <div className="menu-name">
                                消息动态
                            </div>
                        </div>
                        {
                            listLoading === true ? <Spin/> :
                                <div>
                                    {
                                        !(this.isEmptyObject(datas)) ?
                                            <div>
                                                <div className="news-name">{datas.now.topic}</div>
                                                <div className="news-tool">
                                                    <div className="subtitle">
                                                        {`${datas.now.createtime}  来源：${datas.now.source}`}
                                                    </div>
                                                    <div className="tools-share">
                                                        {tagChild}
                                                    </div>
                                                </div>
                                                <div className="news-wrap">
                                                    <div className="news-content" dangerouslySetInnerHTML={{__html:datas.now.content}}>
                                                    </div>
                                                    <div className="news-footer">
                                                        <ul>
                                                            <li className="pre-li">
                                                                <span>上一篇</span>
                                                                {
                                                                    !(this.isEmptyObject(datas.pre)) ? <a href={`/pandora/newsInfo/${datas.pre.id}`}>{datas.pre.topic}</a> : <a href="#base-content">已是第一篇了</a>
                                                                }
                                                            </li>
                                                            <li className="next-li">
                                                                <span>下一篇</span>
                                                                {
                                                                    !(this.isEmptyObject(datas.next)) ? <a href={`/pandora/newsInfo/${datas.next.id}`}>{datas.next.topic}</a> :
                                                                        <a href="#base-content">已是最后一篇了</a>
                                                                }
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        : <div className="empty-news">该动态不存在</div>
                                    }
                                </div>
                        }
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}

// 对外暴露
export default NewsInfo;