import React, {Component} from 'react';
import {Button, Spin, Tag} from 'antd'
import DocumentTitle from 'react-document-title'
import './index.less'
import {queryNote, queryNotebook} from '../../../api'
import {openNotificationWithIcon_} from "../../../utils/window";

/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-09-10 - 21:18
 * 描述：笔记列表
 */

// 定义组件（ES6）
class NoteList extends Component {

    state = {
        tagColor: ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'],
        // 笔记簿数据
        notes: null,
        // 笔记数据
        datas: null,
        // 笔记数
        dataTotal:null,
        listLoading: false,
        // 用户切换选择的笔记簿
        notebookId: null,
        pageSize: 10,
        // 下一页
        nextpage: null,
    }

    initNoteBooks= async () => {
        let _this = this
        const {msg, code, data} = await queryNotebook(null)
        if (code === 0){
            _this.setState({
                notes:data
            })
        } else {
            openNotificationWithIcon_("error", "错误提示", msg);
        }
    }

    /**
     * 获取笔记列表数据
     * @returns {Promise<void>}
     */
    getDatas = async (nowpage) => {
        let _this = this
        let {notebookId,pageSize} = _this.state
        let para = {
            notebookId:notebookId,
            nowPage: nowpage,
            pageSize: pageSize
        };
        // 在发请求前, 显示loading
        this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await queryNote(para);
        // 在请求完成后, 隐藏loading
        this.setState({listLoading: false});
        if (code === 0) {
            // 总数据量
            _this.setState({
                dataTotal: data.dateSum
            })
            // 表格数据
            this.rendering(data);
        } else {
            openNotificationWithIcon_("error", "错误提示", msg);
            this.setState({nextpage: null});
        }
    };

    /**
     * 渲染加工页面数据
     */
    rendering = (data) => {
        let {datas, nextpage} = this.state;
        let localdata = []
        if (!(this.isEmptyObject(data.grid))) {
            //对文件进行二次处理
            for (var i in data.grid) {
                var obj = data.grid[i];
                var b = (obj.createtime).substr(0, 10).split("-");//分割日期，先把空格后的分钟切开
                localdata[i] = Object.assign({},obj)
                localdata[i].month = b[1];
                localdata[i].year = b[0];
                localdata[i].day = b[2];
            }
            //第一页采用直接覆盖的显示方式
            if (data.pageNow === 1 || data.pageNow === '1') {
                datas = localdata;
            } else {
                datas = (datas).concat(localdata);//追加，合并
            }
        } else {
            datas = null;
        }
        //显示是否加载下一页(当前页是最后一页)
        if (data.pageNow === data.totalPage) {
            nextpage = null;
        } else {
            nextpage = data.pageNow + 1;
        }
        this.setState({
            datas: datas,
            nextpage: nextpage
        })
    }


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

    /**
     * 切换笔记簿
     */
    handleSwitchBook = (bookid) =>{
        let _this = this
        _this.setState({
            notebookId: bookid
        },function () {
            _this.getDatas(1)
        })
    }

    forMap = tag => {
        let colors = this.state.tagColor;
        const tagElem = (
            <Tag onClick={() => this.handleSwitchBook(tag.id)}
                color={colors[Math.floor(Math.random()*10)]}>
                {tag.name}
            </Tag>
        );
        return (<span key={tag.id} style={{ display: 'inline-block' }}>{tagElem}</span>
        );
    };

    /**
     * 加载更多
     * @param nextpage
     */
    loadMore = (nextpage) =>{
        console.log(nextpage)
        this.getDatas(nextpage);
    }

    /*
     * 执行异步任务: 发异步ajax请求
     */
    componentDidMount() {
        // 加载笔记簿
        this.initNoteBooks()
        // 加载页面数据
        this.getDatas(1);
    };

    render() {
        // 读取状态数据
        const {datas, listLoading, notes, dataTotal,nextpage} = this.state;
        return (
            <DocumentTitle title="saya.ac.cn-随笔记录">
                <div className="base-content">
                    <div className="child-container">
                        <div className="menu-title">
                            <div className="menu-name">
                                随笔记录
                            </div>
                        </div>
                        <div className="note-lable">
                            {
                                dataTotal >= 0 ? <Tag color="purple" onClick={() => this.handleSwitchBook(null)}>全部</Tag>:<Tag color="purple">全部</Tag>
                            }
                            {
                                !!notes? notes.map(this.forMap):null
                            }
                        </div>
                        {
                            listLoading === true ? <Spin/> :
                                <div id="datagrid">
                                    {datas !== null ? datas.map((item) => (
                                            <div className="newsitem" key={item.id}>
                                                <div className='newsdate'>
                                                    <div className="yearmonthday"><span>{item.month}</span> {item.year+'.'+item.day}</div>
                                                </div>
                                                <div className='newscontent'>
                                                    <div className="newstitle">
                                                        <a href={`/v1/pandora/noteInfo/${item.id}`} rel="noopener noreferrer" target="_blank">{item.topic}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        )):
                                        <div className='null-content'>
                                            好像并没有笔记诶
                                        </div>
                                    }
                                    {nextpage !== null ?
                                        <div className='loadmore-content'>
                                            <Button onClick={() => this.loadMore(nextpage)} type="primary" shape="circle" icon="eye" size='large'/>
                                        </div>
                                        :
                                        <div className='null-content'>
                                            已经加载完笔记了
                                        </div>
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
export default NoteList;
