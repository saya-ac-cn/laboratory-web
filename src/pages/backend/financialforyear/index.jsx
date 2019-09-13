import React, {Component} from 'react';
import {totalTransactionForYear, outTransactionForYearExcel} from "../../../api";
import {openNotificationWithIcon} from "../../../utils/window";
import axios from 'axios'
import DocumentTitle from 'react-document-title'
import {Button, Col, Icon, Table, Form} from "antd";
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-09-01 - 15:09
 * 描述：财务年度报表
 */
// 定义组件（ES6）
class FinancialForYear extends Component {

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
    };

    /*
    * 初始化Table所有列的数组
    */
    initColumns = () => {
        this.columns = [
            {
                title: '产生日期',
                dataIndex: 'tradeDate', // 显示数据对应的属性名
            },
            {
                title: '流入',
                dataIndex: 'deposited', // 显示数据对应的属性名
            },
            {
                title: '流出',
                dataIndex: 'expenditure', // 显示数据对应的属性名
            },
            {
                title: '产生总额',
                dataIndex: 'currencyNumber', // 显示数据对应的属性名
            }
        ]
    };

    /**
     * 获取页面数据
     * @returns {Promise<void>}
     */
    getDatas = async () => {
        let _this = this;
        let para = {
            nowPage: this.state.nowPage,
            pageSize: this.state.pageSize,
        };
        // 在发请求前, 显示loading
        _this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await totalTransactionForYear(para);
        // 在请求完成后, 隐藏loading
        _this.setState({listLoading: false});
        if (code === 0) {
            _this.setState({
                // 总数据量
                dataTotal: data.dateSum,
                // 表格数据
                datas: data.grid
            });
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    };


    // 回调函数,改变页宽大小
    changePageSize = (pageSize, current) => {
        let _this = this;
        // react在生命周期和event handler里的setState会被合并（异步）处理,需要在回调里回去获取更新后的 state.
        _this.setState({
            nowPage: 1,
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
     * 导出财务流水
     */
    exportExcel = () =>{
        let _this = this;
        // 在发请求前, 显示loading
        _this.setState({listLoading: true});
        axios({
            method: "GET",
            url: outTransactionForYearExcel,   //接口地址
            //params: para,           //接口参数
            responseType: 'blob',
            //上面这个参数不加会乱码，据说{responseType: 'arraybuffer'}也可以
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(function (res) {
                _this.setState({listLoading: false});
                let fileName = '财务流水年度报表.xlsx';//excel文件名称
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
                openNotificationWithIcon("error", "错误提示", "导出财务流水年度报表失败");
            });
    }

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
        const {datas, dataTotal, nowPage, pageSize, listLoading} = this.state;
        return (
            <DocumentTitle title="年度报表">
                <section>
                    <Col span={24} className="toolbar">
                        <Form layout="inline">
                            <Form.Item>
                                <Button type="primary" htmlType="button" onClick={this.exportExcel}>
                                    <Icon type="file-excel"/>导出
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col span={24}>
                        <Table size="middle" rowKey='tradeDate' loading={listLoading} columns={this.columns} dataSource={datas}
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
export default FinancialForYear;