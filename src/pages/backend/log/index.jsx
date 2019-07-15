import React, {Component} from 'react';
import {Col, Form, Button, Table, DatePicker, Select} from 'antd';
import {getLogList, getLogType, downloadLogExcel} from '../../../api'
import {openNotificationWithIcon} from '../../../utils/window'
import axios from 'axios'
import './index.less'
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-07-09 - 22:31
 * 描述：
 */
const {RangePicker} = DatePicker;
const {Option} = Select;

// 定义组件（ES6）
class Log extends Component {

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
            // 查询的日期
            date: [],
            beginTime: '',// 搜索表单的开始时间
            endTime: '',// 搜索表单的结束时间
            type: [],// 系统返回的日志类别
            selectType: ''//用户选择的日志类别
        },
    };

    /*
    * 初始化Table所有列的数组
    */
    initColumns = () => {
        this.columns = [
            {
                title: '用户',
                dataIndex: 'user', // 显示数据对应的属性名
            },
            {
                title: '操作详情',
                dataIndex: 'logType.describe', // 显示数据对应的属性名
            },
            {
                title: 'IP',
                dataIndex: 'ip', // 显示数据对应的属性名
            },
            {
                title: '城市',
                dataIndex: 'city', // 显示数据对应的属性名
            },
            {
                title: '日期',
                dataIndex: 'date', // 显示数据对应的属性名
            }
        ]
    };

    /**
     * 获取日志类别
     * @returns {Promise<void>}
     */
    getTypeData = async () => {
        let _this = this;
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getLogType();
        if (code === 0) {
            let filters = _this.state.filters;
            filters.type = data;
            _this.setState({
                filters
            }, function () {
                // 利用更新状态的回调函数，渲染下拉选框
                _this.logType = [];
                _this.logType.push((<Option key={-1} value="null">请选择</Option>));
                let filters = this.state.filters;
                filters.type.forEach(item => {
                    _this.logType.push((<Option key={item.type} value={item.type}>{item.describe}</Option>));
                });
            });
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    };

    /**
     * 获取日志数据
     * @returns {Promise<void>}
     */
    getDatas = async () => {
        let para = {
            nowPage: this.state.nowPage,
            pageSize: this.state.pageSize,
            type: this.state.filters.selectType,
            beginTime: this.state.filters.beginTime,
            endTime: this.state.filters.endTime,
        };
        // 在发请求前, 显示loading
        this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getLogList(para);
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
        let {filters, nowPage} = _this.state;
        nowPage = 1;
        filters.beginTime = '';
        filters.endTime = '';
        filters.selectType = '';
        _this.setState({
            nowPage: nowPage,
            filters: filters
        }, function () {
            _this.getDatas()
        });
    };

    // 回调函数,改变页宽大小
    changePageSize = (pageSize, current) => {
        // react在生命周期和event handler里的setState会被合并（异步）处理,需要在回调里回去获取更新后的 state.
        this.setState({
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
        filters.beginTime = dateString[0];
        filters.endTime = dateString[1];
        _this.setState({
            filters
        }, function () {
            _this.getDatas()
        });
    };

    // 日志选框发生改变
    onChangeType = (value) => {
        let _this = this;
        if (value === 'null') {
            value = ''
        }
        let {filters} = _this.state;
        filters.selectType = value;
        _this.setState({
            filters
        }, function () {
            _this.getDatas()
        });
    };

    exportExcel = () => {
        var _this = this;
        // 在发请求前, 显示loading
        _this.setState({listLoading: true});
        let para = {
            type: this.state.filters.selectType,
            beginTime: this.state.filters.beginTime,
            endTime: this.state.filters.endTime,
        };
        axios({
            method: "GET",
            url: downloadLogExcel,   //接口地址
            data: para,           //接口参数
            responseType: 'blob',
            //上面这个参数不加会乱码，据说{responseType: 'arraybuffer'}也可以
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(function (res) {
                _this.setState({listLoading: false});
                let fileName = '操作日志报表.xlsx';//excel文件名称
                let blob = new Blob([res.data], {type: 'application/x-xlsx'});   //word文档为msword,pdf文档为pdf，excel文档为x-xls
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
                openNotificationWithIcon("error", "错误提示", "导出日志报表失败");
            });
    };


    /*
    *为第一次render()准备数据
    * 因为要异步加载数据，所以方法改为async执行
    */
    componentWillMount() {
        // 初始化日志类别数据
        this.getTypeData();
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
        const {datas, dataTotal, nowPage, pageSize, listLoading} = this.state;
        return (
            <section>
                <Col span={24} className="toolbar">
                    <Form layout="inline">
                        <Form.Item>
                            <Select className="queur-type" showSearch onChange={this.onChangeType}
                                    placeholder="请选择日志类别">
                                {this.logType}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <RangePicker onChange={this.onChangeDate}/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="button" onClick={this.getDatas}>
                                查询
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="button" onClick={this.reloadPage}>
                                重置
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="button" onClick={this.exportExcel}>
                                Excel
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={24}>
                    <Table size="middle" rowKey="id" loading={listLoading} columns={this.columns} dataSource={datas}
                           pagination={{
                               showTotal: () => `当前第${nowPage}页 共${dataTotal}条`,
                               pageSize: pageSize, showQuickJumper: true, total: dataTotal, showSizeChanger: true,
                               onShowSizeChange: (current, pageSize) => this.changePageSize(pageSize, current),
                               onChange: this.changePage,
                           }}/>
                </Col>
            </section>
        );
    }
}

// 对外暴露
export default Log;