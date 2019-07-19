import React, {Component} from 'react';
import {getApi} from "../../../api";
import {openNotificationWithIcon} from "../../../utils/window";
import {Button, Col, Form, Table, Icon, Input} from "antd";
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-07-19 - 23:18
 * 描述：接口管理
 */

// 定义组件（ES6）
class Api extends Component {

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
            name: ''// 按接口名检索
        },
    };

    /*
    * 初始化Table所有列的数组
    */
    initColumns = () => {
        this.columns = [
            {
                title: '接口名',
                dataIndex: 'name', // 显示数据对应的属性名
            },
            {
                title: '状态',
                render: (text, record) => {
                    if (record.status === 1){
                        return '已开放'
                    } else if (record.status === 2) {
                        return '已关闭'
                    } else {
                        return '未知'
                    }
                }
            },
            {
                title: '创建日期',
                dataIndex: 'createtime', // 显示数据对应的属性名
            },
            {
                title: '修改日期',
                dataIndex: 'updatetime', // 显示数据对应的属性名
            },
        ]
    };

    /**
     * 获取接口列表数据
     * @returns {Promise<void>}
     */
    getDatas = async () => {
        let para = {
            nowPage: this.state.nowPage,
            pageSize: this.state.pageSize,
            name: this.state.filters.name,
        };
        // 在发请求前, 显示loading
        this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getApi(para);
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
            <section>
                <Col span={24} className="toolbar">
                    <Form layout="inline">
                        <Form.Item>
                            <Input type='text' placeholder='请输入接口名'/>
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
                            <Button type="primary" htmlType="button">
                                添加
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
export default Api;