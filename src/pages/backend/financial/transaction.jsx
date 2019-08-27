import React, {Component} from 'react';
import DocumentTitle from 'react-document-title'
import moment from 'moment';
import {getTransactionList, getFinancialType, applyTransaction,updateTransaction,deleteTransaction,getTransactionInfo,insertTransactioninfo,updateTransactioninfo,deleteTransactioninfo,downTransaction,outTransactionInfoExcel} from '../../../api'
import {Button, Col, DatePicker, Icon, Input, Form, Select} from "antd";
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
    /**
     * 初始化页面配置信息
     */
    componentWillMount() {
        let _this = this;
        _this.initDatas();
    }

    render() {
        // 读取状态数据
        const {datas, dataTotal, nowPage, pageSize, listLoading, type, filters} = this.state;
        let {beginTime,endTime} = filters;
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
                                <Select style={{width:'200px'}} showSearch
                                        placeholder="请选择交易类别">
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
                </section>
            </DocumentTitle>
        );
    }
}

// 对外暴露
export default Transaction;