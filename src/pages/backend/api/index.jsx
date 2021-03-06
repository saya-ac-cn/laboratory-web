import React, {Component} from 'react';
import {getApi, createApi, editApi, deleteApi} from "../../../api";
import {openNotificationWithIcon} from "../../../utils/window";
import {Button, Col, Form, Table, Icon, Input, Modal} from "antd";
import AddForm from "./add-form"
import EditForm from "./edit-form"
import DocumentTitle from 'react-document-title'
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
            name: null// 按接口名检索
        },
        modalStatus: 0, // 标识添加/更新的确认框是否显示, 0: 都不显示, 1: 显示添加, 2: 显示更新
    };

    /*
    * 初始化Table所有列的数组
    */
    initColumns = () => {
        let _this = this;
        _this.columns = [
            {
                title: '接口名',
                dataIndex: 'name', // 显示数据对应的属性名
            },
            {
                title: '状态',
                render: (text, record) => {
                    if (record.status === 1) {
                        return '已开启'
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
            {
                title: '操作',
                render: (text, record) => (
                    <div>
                        <Button type="primary" onClick={() => this.handleModalEdit(record)} shape="circle" icon="edit"/>
                        &nbsp;
                        <Button type="danger" onClick={() => this.handleDellApi(record)} shape="circle" icon="delete"/>
                    </div>
                ),
            },
        ]
    };

    /**
     * 获取接口列表数据
     * @returns {Promise<void>}
     */
    getDatas = async () => {
        let _this = this;
        let para = {
            nowPage: _this.state.nowPage,
            pageSize: _this.state.pageSize,
            name: _this.state.filters.name,
        };
        // 在发请求前, 显示loading
        _this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getApi(para);
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

    /**
     * 刷新页面
     */
    reloadPage = () => {
        // 重置查询条件
        let _this = this;
        let filters = _this.state.filters;
        filters.beginTime = '';
        filters.endTime = '';
        filters.name = '';
        _this.setState({
            nowPage: 1,
            filters: filters
        }, function () {
            _this.getDatas()
        });
    };

    // 回调函数,改变页宽大小
    changePageSize = (pageSize, current) => {
        let _this = this;
        // react在生命周期和event handler里的setState会被合并（异步）处理,需要在回调里回去获取更新后的 state.
        _this.setState({
            nowPage:1,
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
     * 接口名文本框内容改变事件（用于双向绑定数据）
     * @param event
     */
    nameInputChange = (event) => {
        let _this = this;
        const value = event.target.value;
        let filters = _this.state.filters;
        filters.name = value;
        _this.setState({
            filters,
            nowPage:1,
        })
    };

    /*
    * 显示添加的弹窗
    */
    handleModalAdd = () => {
        this.setState({
            modalStatus: 1
        })
    };

    /*
    * 显示修改的弹窗
    */
    handleModalEdit = (value) => {
        this.lineDate = value;
        this.setState({
            modalStatus: 2
        })
    };

    /*
    * 响应点击取消: 隐藏弹窗
    */
    handleModalCancel = () => {
        // 清除输入数据
        this.form.resetFields();
        // 隐藏确认框
        this.setState({
            modalStatus: 0
        })
    };

    /**
     * 提交表单，添加接口
     */
    handleAddApi = () => {
        let _this = this;
        _this.form.validateFields((err, values) => {
            if (!err) {
                Modal.confirm({
                    title: '操作确认',
                    content: '您确定创建该接口?',
                    onOk: async () => {
                        // 关闭页面表单
                        _this.setState({
                            modalStatus: 0,
                            listLoading: true
                        });
                        let para = {
                            name: values.name,
                            status: values.status,
                            descript: values.descript
                        };
                        // 清除输入数据
                        _this.form.resetFields();
                        const {msg, code} = await createApi(para);
                        // 在请求完成后, 隐藏loading
                        _this.setState({listLoading: false});
                        if (code === 0) {
                            openNotificationWithIcon("success", "操作结果", "添加成功");
                            _this.getDatas();
                        } else {
                            openNotificationWithIcon("error", "错误提示", msg);
                        }
                    },
                    onCancel() {
                        return false;
                    },
                });
            } else {
                openNotificationWithIcon("error", "错误提示", "您填写的表单有误，请根据提示正确填写。");
            }
        })
    };

    /**
     * 修改接口
     */
    handleEditApi = () => {
        let _this = this;
        // 进行表单验证, 只有通过了才处理
        _this.form.validateFields(async (err, values) => {
            if (!err) {
                Modal.confirm({
                    title: '修改确认',
                    content: '您确定要保存此次修改结果?',
                    onOk: async () => {
                        // 关闭页面表单
                        _this.setState({
                            modalStatus: 0,
                            listLoading: true
                        });
                        let para = {
                            id: _this.lineDate.id,
                            name: values.name,
                            status: values.status,
                            descript: values.descript
                        };
                        // 清除输入数据
                        _this.form.resetFields();
                        const {msg, code} = await editApi(para);
                        // 在请求完成后, 隐藏loading
                        _this.setState({listLoading: false});
                        if (code === 0) {
                            openNotificationWithIcon("success", "操作结果", "修改成功");
                            _this.getDatas();
                        } else {
                            openNotificationWithIcon("error", "错误提示", msg);
                        }
                    },
                    onCancel() {
                        return false;
                    },
                });
            } else {
                openNotificationWithIcon("error", "错误提示", "您填写的表单有误，请根据提示正确填写。");
            }
        })
    };

    /*
    * 删除指定接口
    */
    handleDellApi = (item) => {
        let _this = this;
        Modal.confirm({
            title: '删除确认',
            content: `确认删除${item.name}接口吗?`,
            onOk: async () => {
                // 在发请求前, 显示loading
                _this.setState({listLoading: true});
                let para = { id: item.id };
                const {msg, code} = await deleteApi(para);
                // 在请求完成后, 隐藏loading
                _this.setState({listLoading: false});
                if (code === 0) {
                    openNotificationWithIcon("success", "操作结果", "删除成功");
                    _this.getDatas();
                } else {
                    openNotificationWithIcon("error", "错误提示", msg);
                }
            }
        })
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
        const {datas, dataTotal, nowPage, pageSize, listLoading, filters, modalStatus} = this.state;
        // 读取所选中的行数据
        const api = this.lineDate || {}; // 如果还没有指定一个空对象
        return (
            <DocumentTitle title='接口管理'>
                <section>
                    <Col span={24} className="toolbar">
                        <Form layout="inline">
                            <Form.Item>
                                <Input type='text' value={filters.name} onChange={this.nameInputChange}
                                       placeholder='请输入接口名'/>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="button" onClick={this.getDatas}>
                                    <Icon type="search"/>查询
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="button" onClick={this.reloadPage}>
                                    <Icon type="reload"/>重置
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="button" onClick={this.handleModalAdd}>
                                    <Icon type="plus"/>添加
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col span={24} className="dataTable">
                        <Table size="middle" rowKey="id" loading={listLoading} columns={this.columns} dataSource={datas}
                               pagination={{
                                   current:nowPage,
                                   showTotal: () => `当前第${nowPage}页 共${dataTotal}条`,
                                   pageSize: pageSize, showQuickJumper: true, total: dataTotal, showSizeChanger: true,
                                   onShowSizeChange: (current, pageSize) => this.changePageSize(pageSize, current),
                                   onChange: this.changePage,
                               }}/>
                    </Col>
                    <Modal
                        title="创建接口"
                        visible={modalStatus === 1}
                        onOk={this.handleAddApi}
                        onCancel={this.handleModalCancel}>
                        <AddForm setForm={(form) => {
                            this.form = form
                        }}/>
                    </Modal>
                    <Modal
                        title="修改接口"
                        visible={modalStatus === 2}
                        onOk={this.handleEditApi}
                        onCancel={this.handleModalCancel}>
                        <EditForm api={api} setForm={(form) => {
                            this.form = form
                        }}/>
                    </Modal>
                </section>
            </DocumentTitle>
        );
    }
}

// 对外暴露
export default Api;