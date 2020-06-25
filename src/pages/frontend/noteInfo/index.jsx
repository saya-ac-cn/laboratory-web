import React, {Component} from 'react';
import DocumentTitle from 'react-document-title'
import './index.less'
import {queryNotesInfo} from "../../../api";
import {openNotificationWithIcon_} from "../../../utils/window";
import {isEmptyObject} from "../../../utils/var"
import {Spin, Tag} from "antd";
import Editor from 'for-editor'
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-09-09 - 21:08
 * 描述：笔记详情
 */

// 定义组件（ES6）
class NoteInfo extends Component {

    state = {
        datas: null,
        // 笔记编号
        id: null,
        listLoading: false,
        tagColor: ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'],
    }

    /**
     * 获取笔记详情数据
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
        const {msg, code, data} = await queryNotesInfo(para);
        // 在请求完成后, 隐藏loading
        this.setState({listLoading: false});
        if (code === 0) {
            var thisNotes = data.now;
            thisData = data
            thisData.now.topic = thisNotes.topic
            thisData.now.label = thisNotes.label === null ? [] : (thisNotes.label).split(';')
            thisData.now.content = thisNotes.content
            this.setState({
                datas: thisData
            });
        } else {
            openNotificationWithIcon_("error", "错误提示", msg);
        }
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
        let title = '笔记详情'
        let tagChild = []
        if (!(isEmptyObject(datas))){
            if (!(isEmptyObject(datas.now))) {
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
                                笔记详情
                            </div>
                        </div>
                        {
                            listLoading === true ? <Spin/> :
                                <div>
                                    {
                                        !(isEmptyObject(datas)) ?
                                            <div>
                                                <div className="news-name">{datas.now.topic}</div>
                                                <div className="news-tool">
                                                    <div className="subtitle">
                                                        {`${datas.now.createtime}  来源：${datas.now.notebook.source}`}
                                                    </div>
                                                    <div className="tools-share">
                                                        {tagChild}
                                                    </div>
                                                </div>
                                                <div className="news-wrap">
                                                    <div className="news-content">
                                                        {/*dangerouslySetInnerHTML={{__html:datas.now.content}}*/}
                                                        <Editor
                                                            heigh="auto"
                                                            value={datas.now.content}
                                                            style={{border:'none',boxShadow:'none',background:'none',height:'100%'}}
                                                            toolbar={{}}
                                                            preview={true} />
                                                    </div>
                                                    <div className="news-footer">
                                                        <ul>
                                                            <li className="pre-li">
                                                                <span>上一篇</span>
                                                                {
                                                                    !(isEmptyObject(datas.pre)) ? <a href={`/v1/pandora/noteInfo/${datas.pre.id}`}>{datas.pre.topic}</a> : <a href="#base-content">已是第一篇了</a>
                                                                }
                                                            </li>
                                                            <li className="next-li">
                                                                <span>下一篇</span>
                                                                {
                                                                    !(isEmptyObject(datas.next)) ? <a href={`/v1/pandora/noteInfo/${datas.next.id}`}>{datas.next.topic}</a> :
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
export default NoteInfo;
