import React, {Component} from 'react';
import {Button, Col, Icon, Input, Form, Table, DatePicker, Modal} from "antd";
import {getMemoList, getMemo, createMemo, updateMemo, deleteMemo} from "../../../api";
import {openNotificationWithIcon} from "../../../utils/window";
import moment from 'moment';
import DocumentTitle from 'react-document-title'
import EditMemo from "./edit";

/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-09-22 - 17:35
 * 描述：便笺
 */
const {RangePicker} = DatePicker;

// 定义组件（ES6）
class Memo extends Component {

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
            title: null, // 标题
        },
        modalStatus: 0, // 标识添加/更新的确认框是否显示, 0: 都不显示, 1: 显示添加, 2: 显示更新
    };

    /*
    * 初始化Table所有列的数组
    */
    initColumns = () => {
        this.columns = [
            {
                title: '标题',
                dataIndex: 'title', // 显示数据对应的属性名
            },
            {
                title: '创建者',
                dataIndex: 'source', // 显示数据对应的属性名
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
                title: '操作',
                render: (text, record) => (
                    <div>
                        <Button type="primary" onClick={() => this.handleModalEdit(record)} shape="circle" icon="edit"/>
                        &nbsp;
                        <Button type="danger" onClick={() => this.handleDellMemo(record)} shape="circle" icon="delete"/>
                    </div>
                ),
            },
        ]
    };

    /**
     * 获取笔记簿列表数据
     * @returns {Promise<void>}
     */
    getDatas = async () => {
        let para = {
            title: this.state.filters.title,
            nowPage: this.state.nowPage,
            pageSize: this.state.pageSize,
            status: this.state.filters.status,
            beginTime: this.state.filters.beginTime,
            endTime: this.state.filters.endTime,
        };
        // 在发请求前, 显示loading
        this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getMemoList(para);
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

    /**
     * 刷新
     */
    reloadPage = () => {
        // 重置查询条件
        let _this = this;
        let filters = _this.state.filters;
        filters.name = null;
        filters.status = null;
        _this.setState({
            nowPage: 1,
            filters: filters,
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
        if (dateString[0] !== '' && dateString[1] !== '') {
            filters.beginTime = dateString[0];
            filters.endTime = dateString[1];
        } else {
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

    /**
     * 双向绑定用户查询主题
     * @param event
     */
    titleInputChange = (event) => {
        let _this = this;
        const value = event.target.value;
        let filters = _this.state.filters;
        filters.title = value;
        _this.setState({
            nowPage: 1,
            filters
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
    handleModalEdit = async (value) => {
        let _this = this;
        let para = {
            id: value.id
        }
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getMemo(para)
        if (code === 0) {
            _this.line = data;
            _this.setState({
                modalStatus: 2
            })
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    };

    /*
   * 响应点击取消: 隐藏弹窗
   */
    handleModalCancel = () => {
        this.line = {};
        // 清除输入数据
        this.form.resetFields();
        // 隐藏确认框
        this.setState({
            modalStatus: 0
        })
    };

    /**
     * 提交表单，添加便利贴
     */
    handleAddMemo = () => {
        let _this = this;
        _this.form.validateFields((err, values) => {
            if (!err) {
                Modal.confirm({
                    title: '您确定创建该便笺?',
                    onOk: async () => {
                        // 关闭页面表单
                        _this.setState({
                            modalStatus: 0,
                            listLoading: true
                        });
                        let para = {
                            title: values.title,
                            content: values.content
                        };
                        // 清除输入数据
                        _this.form.resetFields();
                        const {msg, code} = await createMemo(para);
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
    }

    /**
     * 修改便利贴
     */
    handleEditMemo = () => {
        let _this = this;
        // 进行表单验证, 只有通过了才处理
        _this.form.validateFields(async (err, values) => {
            if (!err) {
                Modal.confirm({
                    title: '您确定要保存此次修改结果?',
                    onOk: async () => {
                        // 关闭页面表单
                        _this.setState({
                            modalStatus: 0,
                            listLoading: true
                        });
                        let para = {
                            id: _this.line.id,
                            title: values.title,
                            content: values.content
                        };
                        // 清除输入数据
                        _this.form.resetFields();
                        const {msg, code} = await updateMemo(para);
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
    * 删除指定便利贴
    */
    handleDellMemo = (item) => {
        let _this = this;
        Modal.confirm({
            title: '删除确认',
            content: `确认删除标题为:${item.title}的便利贴吗?`,
            cancelText: '再想想',
            okText: '不要啦',
            onOk: async () => {
                // 在发请求前, 显示loading
                _this.setState({listLoading: true});
                let para = { id: item.id };
                const {msg, code} = await deleteMemo(para);
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
     * 为第一次render()准备数据
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
        let {beginTime, endTime, title} = filters;
        let rangeDate;
        if (beginTime !== null && endTime !== null) {
            rangeDate = [moment(beginTime), moment(endTime)]
        } else {
            rangeDate = [null, null]
        }
        // 读取所选中的行数据
        const line = this.line || {}; // 如果还没有指定一个空对象
        return (
            <DocumentTitle title='便利贴'>
                <section>
                    <Col span={24} className="toolbar">
                        <Form layout="inline">
                            <Form.Item>
                                <Input type='text' value={title} onChange={this.titleInputChange}
                                       placeholder='按标题检索'/>
                            </Form.Item>
                            <Form.Item>
                                <RangePicker value={rangeDate} onChange={this.onChangeDate}/>
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
                                    <Icon type="plus"/>创建
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col span={24} className="dataTable">
                        <Table size="middle" rowKey="id" loading={listLoading} columns={this.columns} dataSource={datas}
                               pagination={{
                                   current: nowPage,
                                   showTotal: () => `当前第${nowPage}页 共${dataTotal}条`,
                                   pageSize: pageSize, showQuickJumper: true, total: dataTotal, showSizeChanger: true,
                                   onShowSizeChange: (current, pageSize) => this.changePageSize(pageSize, current),
                                   onChange: this.changePage,
                               }}/>
                    </Col>
                    <Modal
                        title="新建便利贴"
                        visible={modalStatus === 1}
                        onOk={this.handleAddMemo}
                        onCancel={this.handleModalCancel}>
                        <EditMemo memo={line} setForm={(form) => {
                            this.form = form
                        }}/>
                    </Modal>
                    <Modal
                        title="编辑便利贴"
                        visible={modalStatus === 2}
                        onOk={this.handleEditMemo}
                        onCancel={this.handleModalCancel}>
                        <EditMemo memo={line} enitNum={1} setForm={(form) => {
                            this.form = form
                        }}/>
                    </Modal>
                </section>
            </DocumentTitle>
        );
    }
}

// 对外暴露
export default Memo;