import React, {Component} from 'react';
import './index.less'
import {downloadBackUpDB, getBackUpDBList} from "../../../api";
import {openNotificationWithIcon} from "../../../utils/window";
import {Button, Col, Form, DatePicker, Table,Icon} from "antd";
import moment from 'moment';
import axios from "axios";
import DocumentTitle from 'react-document-title'
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-07-09 - 22:44
 * 描述：数据库备份管理
 */
const {RangePicker} = DatePicker;

// 定义组件（ES6）
class DB extends Component {

    state = {
        // 返回的单元格数据
        datas: [],
        // 总数据行数
        dataTotal: 0,
        // 当前页
        nowPage: 1,
        // 页面宽度
        pageSize: 10,
        // 是否显示加载
        listLoading: false,
        filters: {
            beginTime: null,// 搜索表单的开始时间
            endTime: null,// 搜索表单的结束时间
        },
    };

    /*
    * 初始化Table所有列的数组
    */
    initColumns = () => {
        this.columns = [
            {
                title: '归档日期',
                dataIndex: 'archiveDate', // 显示数据对应的属性名
            },
            {
                title: '存放路径',
                dataIndex: 'url', // 显示数据对应的属性名
            },
            {
                title: '备份时间',
                dataIndex: 'createtime', // 显示数据对应的属性名
            },
            {
                title: '下载',
                render: (text, record) => (
                    <span onClick={() => this.downloadFile(record)}>
                        <Icon type="cloud-download" />
                    </span>
                ),
            },
        ]
    };

    /**
     * 获取备份数据
     * @returns {Promise<void>}
     */
    getDatas = async () => {
        let para = {
            nowPage: this.state.nowPage,
            pageSize: this.state.pageSize,
            beginTime: this.state.filters.beginTime,
            endTime: this.state.filters.endTime,
        };
        // 在发请求前, 显示loading
        this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getBackUpDBList(para);
        // 在请求完成后, 隐藏loading
        this.setState({listLoading: false});
        if (code === 0) {
            this.setState({
                // 总数据量
                dataTotal: data.dateSum,
                // 表格数据
                datas: data.grid
            });
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    };

    reloadPage = () => {
        // 重置查询条件
        let _this = this;
        let filters = _this.state.filters;
        filters.beginTime = null;
        filters.endTime = null;
        _this.setState({
            nowPage: 1,
            filters: filters
        }, function () {
            _this.getDatas()
        });
    };

    // 回调函数,改变页宽大小
    changePageSize = (pageSize, current) => {
        // react在生命周期和event handler里的setState会被合并（异步）处理,需要在回调里回去获取更新后的 state.
        this.setState({
            nowPage: 1,
            pageSize: pageSize
        }, function () {
            this.getDatas();
        });
    };

    // 回调函数，页面发生跳转
    changePage = (current) => {
        this.setState({
            nowPage: current,
        }, function () {
            this.getDatas();
        });
    };

    // 日期选择发生变化
    onChangeDate = (date, dateString) => {
        let _this = this;
        let {filters} = _this.state;
        // 为空要单独判断
        if (dateString[0] !== '' && dateString[1] !== ''){
            filters.beginTime = dateString[0];
            filters.endTime = dateString[1];
        }else{
            filters.beginTime = null;
            filters.endTime = null;
        }
        _this.setState({
            nowPage: 1,
            filters
        }, function () {
            _this.getDatas()
        });
    };

    downloadFile = (row) => {
        let _this = this;
        // 在发请求前, 显示loading
        _this.setState({listLoading: true});
        axios({
            method: "GET",
            url: downloadBackUpDB+"?archiveDate="+row.archiveDate,   //接口地址
            responseType: 'blob',
            //上面这个参数不加会乱码，据说{responseType: 'arraybuffer'}也可以
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(function (res) {
                _this.setState({listLoading: false});
                let fileName = row.archiveDate+'.sql';//文件名称
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
                openNotificationWithIcon("error", "错误提示", "导出数据库备份失败"+res);
            });
    };


    /*
    *为第一次render()准备数据
    * 因为要异步加载数据，所以方法改为async执行
    */
    componentWillMount() {
        // 初始化表格属性设置
        this.initColumns();
    };

    /*
    执行异步任务: 发异步ajax请求
     */
    componentDidMount() {
        // 加载页面数据
        this.getDatas();
    };

    render() {
        // 读取状态数据
        const {datas, dataTotal, nowPage, pageSize, listLoading,filters} = this.state;
        let {beginTime,endTime} = filters;
        let rangeDate;
        if (beginTime !== null && endTime !== null){
            rangeDate = [moment(beginTime),moment(endTime)]
        } else {
            rangeDate = [null,null]
        }
        return (
            <DocumentTitle title='数据库备份'>
                <section>
                    <Col span={24} className="toolbar">
                        <Form layout="inline">
                            <Form.Item>
                                <RangePicker value={rangeDate} onChange={this.onChangeDate}/>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="button" onClick={this.getDatas}>
                                    <Icon type="search" />查询
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="button" onClick={this.reloadPage}>
                                    <Icon type="reload" />重置
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col span={24}>
                        <Table size="middle" rowKey="url" loading={listLoading} columns={this.columns} dataSource={datas}
                               pagination={{
                                   current:nowPage,
                                   showTotal: () => `当前第${nowPage}页 共${dataTotal}条`,
                                   pageSize: pageSize, showQuickJumper: true, total: dataTotal, showSizeChanger: true,
                                   onShowSizeChange: (current, pageSize) => this.changePageSize(pageSize, current),
                                   onChange: this.changePage,
                               }}/>
                    </Col>
                </section>
            </DocumentTitle>
        );
    }
}

// 对外暴露
export default DB;