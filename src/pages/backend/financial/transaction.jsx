import React, {Component} from 'react';
import DocumentTitle from 'react-document-title'
import moment from 'moment';
import {getTransactionList, getFinancialType, applyTransaction,updateTransaction,deleteTransaction,getTransactionInfo,insertTransactioninfo,updateTransactioninfo,deleteTransactioninfo,downTransaction,outTransactionInfoExcel} from '../../../api'
import {Button, Col, DatePicker, Icon, Input, Form, Select, Table} from "antd";
import {openNotificationWithIcon} from "../../../utils/window";
/*
 * 文件名：transaction.jsx
 * 作者：liunengkai
 * 创建日期：2019-08-27 - 21:46
 * 描述：流水申报
 */
const {RangePicker} = DatePicker;
const {Option} = Select;
// 定义组件（ES6）
class Transaction extends Component {

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
            tradeType: ''//用户选择的交易类别
        },
        type: [],// 系统返回的交易类别
    }


    /*
    * 初始化Table所有列的数组
    */
    initColumns = () => {
        this.columns = [
            {
                title: '流水号',
                dataIndex: 'tradeId', // 显示数据对应的属性名
            },
            {
                title: '存入',
                dataIndex: 'deposited', // 显示数据对应的属性名
            },
            {
                title: '取出',
                dataIndex: 'expenditure',// 显示数据对应的属性名
            },
            {
                title: '交易方式',
                dataIndex: 'tradeTypeEntity.transactionType',// 显示数据对应的属性名
            },
            {
                title: '产生总额',
                dataIndex: 'currencyNumber',// 显示数据对应的属性名
            },
            {
                title: '摘要',
                dataIndex: 'transactionAmount',// 显示数据对应的属性名
            },
            {
                title: '创建时间',
                dataIndex: 'createtime', // 显示数据对应的属性名
            },
            {
                title: '修改时间',
                dataIndex: 'updatetime', // 显示数据对应的属性名
            },
            {
                title: '管理',
                render: (text, record) => (
                    <div>
                        <Button type="primary" shape="circle" icon="eye"/>
                        &nbsp;
                        <Button type="primary" shape="circle" icon="edit"/>
                        &nbsp;
                        <Button type="danger"  shape="circle" icon="delete"/>
                    </div>
                ),
            },
        ]
    };

    /**
     * 获取财政列表数据
     * @returns {Promise<void>}
     */
    getDatas = async () => {
        let para = {
            tradeType: this.state.filters.tradeType,
            nowPage: this.state.nowPage,
            pageSize: this.state.pageSize,
            beginTime: this.state.filters.beginTime,
            endTime: this.state.filters.endTime,
        };
        // 在发请求前, 显示loading
        this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getTransactionList(para)
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
    }

    /**
     * 刷新
     */
    reloadPage = () => {
        // 重置查询条件
        let _this = this;
        let {filters, nowPage} = _this.state;
        nowPage = 1;
        filters.beginTime = null;
        filters.endTime = null;
        filters.tradeType = null;
        _this.setState({
            nowPage: nowPage,
            filters: filters,
        }, function () {
            _this.getDatas()
        });
    };


    // 回调函数,改变页宽大小
    changePageSize = (pageSize, current) => {
        let _this = this;
        // react在生命周期和event handler里的setState会被合并（异步）处理,需要在回调里回去获取更新后的 state.
        _this.setState({
            pageSize: pageSize
        }, function () {
            _this.getDatas();
        });
    };

    // 回调函数，页面发生跳转
    changePage = (current) => {
        let _this = this;
        _this.setState({
            nowPage: current,
        }, function () {
            _this.getDatas();
        });
    };

    /**
     * 得到交易类别
     */
    initDatas = async () => {
        let _this = this;
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getFinancialType()
        if (code === 0) {
            let type = [];
            data.forEach(item => {
                type.push((<Option key={item.id} value={item.id}>{item.transactionType}</Option>));
            });
            _this.setState({
                type
            })
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    }

    // 日期选择发生变化
    onChangeDate = (date, dateString) => {
        let _this = this;
        let {filters} = _this.state;
        // 为空要单独判断
        if (dateString[0] !== '' && dateString[1] !== '') {
            filters.beginTime = dateString[0];
            filters.endTime = dateString[1];
        } else {
            filters.beginTime = null;
            filters.endTime = null;
        }
        _this.setState({
            filters
        }, function () {
            _this.getDatas()
        });
    };

    // 日志选框发生改变
    onChangeType = (value) => {
        let _this = this;
        let {filters} = _this.state;
        filters.tradeType = value;
        _this.setState({
            filters
        }, function () {
            _this.getDatas()
        });
    };

    /**
     * 初始化页面配置信息
     */
    componentWillMount() {
        this.initDatas();
        // 初始化表格属性设置
        this.initColumns();
    }

    /*
    执行异步任务: 发异步ajax请求
     */
    componentDidMount() {
        // 加载页面数据
        this.getDatas();
    };

    render() {
        // 读取状态数据
        const {datas, dataTotal, nowPage, pageSize, listLoading, type, filters} = this.state;
        let {beginTime,endTime,tradeType} = filters;
        let rangeDate;
        if (beginTime !== null && endTime !== null){
            rangeDate = [moment(beginTime),moment(endTime)]
        } else {
            rangeDate = [null,null]
        }
        return (
            <DocumentTitle title="财务流水">
                <section>
                    <Col span={24} className="toolbar">
                        <Form layout="inline">
                            <Form.Item>
                                <Select style={{width:'200px'}} value={tradeType} showSearch onChange={this.onChangeType}
                                        allowClear={true}  placeholder="请选择交易类别">
                                    {type}
                                </Select>
                            </Form.Item>
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
                            <Form.Item>
                                <Button type="primary" htmlType="button">
                                    <Icon type="plus"/>申报
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col span={24}>
                        <Table size="middle" rowKey="tradeId" loading={listLoading} columns={this.columns} dataSource={datas}
                               pagination={{
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
export default Transaction;