import React, {Component} from 'react';
import {Button, Icon, Spin} from 'antd'
import DocumentTitle from 'react-document-title'
import './index.less'
import {downloadFiles, queryFile} from "../../../api";
import {openNotificationWithIcon} from "../../../utils/window";
import axios from "axios";
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-09-08 - 16:50
 * 描述：文件下载
 */

// 定义组件（ES6）
class FilesDownload extends Component {

    state = {
        // 返回的单元格数据
        datas: [],
        // 是否显示加载
        listLoading: false,
        // 下一页
        nextpage: 1,
        // 页面宽度
        pageSize: 10,
    };

    /**
     * 获取文件列表数据
     * @returns {Promise<void>}
     */
    getDatas = async (nowpage) => {
        let para = {
            nowPage: nowpage,
            pageSize: this.state.pageSize
        };
        // 在发请求前, 显示loading
        this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await queryFile(para);
        // 在请求完成后, 隐藏loading
        this.setState({listLoading: false});
        if (code === 0) {
            // 表格数据
            this.rendering(data);
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
            this.setState({nextpage: null});
        }
    };

    /**
     * 加载更多
     * @param nextpage
     */
    loadMore = (nextpage) =>{
        console.log(nextpage)
        this.getDatas(nextpage);
    }

    /**
     * 渲染日期
     */
    rendering = (data) => {
        let {datas, nextpage} = this.state;
        let localdata = []
        if (!(this.isEmptyObject(data.grid))) {
            //对文件进行二次处理
            for (var i in data.grid) {
                var obj = data.grid[i];
                var b = (obj.date).substr(0, 10).split("-");//分割日期，先把空格后的分钟切开
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
     * 下载文件
     * @param row
     */
    downloadFile = (row) => {
        let _this = this;
        // 在发请求前, 显示loading
        _this.setState({listLoading: true});
        axios({
            method: "GET",
            url: downloadFiles+row.id,   //接口地址
            responseType: 'blob',
            //上面这个参数不加会乱码，据说{responseType: 'arraybuffer'}也可以
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(function (res) {
                console.log(res)
                _this.setState({listLoading: false});
                let fileName = row.filename;//文件名称
                let blob = new Blob([res.data]);
                if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, fileName);
                } else {
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                }
            })
            .catch(function (res) {
                _this.setState({listLoading: false});
                openNotificationWithIcon("error", "错误提示", "下载文件失败"+res);
            });
    };

    /*
     * 执行异步任务: 发异步ajax请求
     */
    componentDidMount() {
        // 加载页面数据
        this.getDatas(1);
    };

    render() {
        // 读取状态数据
        const {datas, nextpage, listLoading} = this.state;
        return (
            <DocumentTitle title="saya.ac.cn-文档下载">
                <div className="base-content">
                    <div className="child-container">
                        <div className="menu-title">
                            <div className="menu-name">
                                文档下载
                            </div>
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
                                                    {item.filename}
                                                </div>
                                                <Button type="link" onClick={() => this.downloadFile(item)}><Icon type='download'/></Button>
                                            </div>
                                        </div>
                                    )):
                                        <div className='null-content'>
                                            好像并没有文档诶
                                        </div>
                                    }
                                    {nextpage !== null ?
                                        <div className='loadmore-content'>
                                            <Button onClick={() => this.loadMore(nextpage)} type="primary" shape="circle" icon="eye" size='large'/>
                                        </div>
                                        :
                                        <div className='null-content'>
                                            已经加载完文档了
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
export default FilesDownload;