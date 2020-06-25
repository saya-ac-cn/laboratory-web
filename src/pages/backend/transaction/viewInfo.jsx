import React, {Component} from 'react';
import {Button, Form, Icon, Input, Modal, Select, Table} from "antd";
import {getTransactionInfo, insertTransactioninfo, updateTransactioninfo, deleteTransactioninfo} from "../../../api";
import {openNotificationWithIcon} from "../../../utils/window";
import PropTypes from "prop-types";

/*
 * 文件名：viewInfo.jsx
 * 作者：liunengkai
 * 创建日期：2019-08-31 - 18:25
 * 描述：预览财务流水明细
 */
const {Option} = Select;

// 定义组件（ES6）
class ViewInfo extends Component {

    /**
     * 设置参数传递是否为空，数据类型等要求属性：
     * @type {{setForm: (*|Validator<NonNullable<T>>|(() => any))}}
     */
    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
        tradeId: PropTypes.number,// 父端返回的交易类别
    };

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
        tradeId: -1,
        // 修改明细
        editItem: {
            id: -1,
            tradeId: -1,
            flog: 2,
            currencyNumber: 0,
            currencyDetails: ''
        },
    }

    /**
     * 重置页面数据
     */
    resetEditForm = () => {
        let editItem = {
            id: -1,
            tradeId: -1,
            flog: 2,
            currencyNumber: 0,
            currencyDetails: ''
        }
        this.setState({
            editItem
        })
    }

    /**
     * 在组件接收新props时调用。初始渲染不调用此方法
     * @param data
     * 子父组件传值问题：https://www.jianshu.com/p/713206e571cf
     */
    componentDidUpdate(props) {
        let _this = this;
        if (props.tradeId !== _this.props.tradeId) {
            _this.setState({tradeId: _this.props.tradeId}, function () {
                _this.getDatas()
                _this.resetEditForm()
            })
        }
    }


    /*
    * 初始化Table所有列的数组
    */
    initColumns = () => {
        this.columns = [
            {
                title: '编号',
                dataIndex: 'id', // 显示数据对应的属性名
            },
            {
                title: '流水号',
                dataIndex: 'tradeId', // 显示数据对应的属性名
            },
            {
                title: '出入方式',
                render: (text, record) => {
                    if (record.flog === 1) {
                        return '存入'
                    } else if (record.flog === 2) {
                        return '取出'
                    } else {
                        return '未知'
                    }
                }
            },
            {
                title: '金额',
                dataIndex: 'currencyNumber', // 显示数据对应的属性名
            },
            {
                title: '说明',
                dataIndex: 'currencyDetails', // 显示数据对应的属性名
            },
            {
                title: '管理',
                render: (text, record) => (
                    <div>
                        <Button type="primary" onClick={() => this.handleViewItem(record)} shape="circle" icon="edit"/>
                        &nbsp;
                        <Button type="danger" onClick={() => this.handleDeleteItem(record)} shape="circle" icon="delete"/>
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
            tradeId: this.state.tradeId,
            nowPage: this.state.nowPage,
            pageSize: this.state.pageSize
        };
        // 在发请求前, 显示loading
        this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getTransactionInfo(para)
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

    // 显示要修改的明细
    handleViewItem(row) {
        this.setState({
            editItem: Object.assign({}, row)
        })
        console.log(row)
    }

    /**
     * 添加流水明细
     */
    handleAddItem = (e) => {
        // 阻止表单的默认提交
        e.preventDefault();
        let _this = this
        _this.props.form.validateFields(['viewAddFlog', 'viewAddCurrencyNumber', 'viewAddCurrencyDetails'], async (err, values) => {
            console.log(values)
            if (!err) {
                _this.setState({listLoading: true});
                let para = {
                    tradeId: _this.props.tradeId,
                    flog: values.viewAddFlog,
                    currencyNumber: values.viewAddCurrencyNumber,
                    currencyDetails: values.viewAddCurrencyDetails
                }
                const {msg, code} = await insertTransactioninfo(para)
                _this.setState({listLoading: false});
                if (code === 0) {
                    _this.props.form.resetFields(['viewAddFlog', 'viewAddCurrencyNumber', 'viewAddCurrencyDetails'])
                    openNotificationWithIcon("success", "操作结果", "添加流水明细成功");
                    _this.getDatas();
                } else {
                    openNotificationWithIcon("error", "错误提示", msg);
                }
            }
        })
    }

    /**
     * 修改流水明细
     * @param e
     */
    handleEditItem = (e) => {
        // 阻止表单的默认提交
        e.preventDefault();
        let _this = this
        let editItem = _this.state.editItem
        if (editItem.id === -1 || editItem.tradeId === -1) {
            openNotificationWithIcon("info", "操作提示", "先选择您要操作的明细，然后再修改");
            // 清空表单数据
            _this.props.form.resetFields(['viewEditFlog', 'viewEditCurrencyNumber', 'viewEditCurrencyDetails'])
        } else {
            _this.props.form.validateFields(['viewEditFlog', 'viewEditCurrencyNumber', 'viewEditCurrencyDetails'], async (err, values) => {
                console.log(values, _this.state.editItem)
                if (!err) {
                    editItem.flog = values.viewEditFlog
                    editItem.currencyNumber = values.viewEditCurrencyNumber
                    editItem.currencyDetails = values.viewEditCurrencyDetails
                    _this.setState({listLoading: true});
                    const {msg, code} = await updateTransactioninfo(editItem)
                    _this.setState({listLoading: false});
                    if (code === 0) {
                        openNotificationWithIcon("success", "操作结果", "修改流水明细成功");
                        // 清空表单数据
                        _this.props.form.resetFields(['viewEditFlog', 'viewEditCurrencyNumber', 'viewEditCurrencyDetails'])
                        // 释放缓存数据
                        editItem.id = -1
                        editItem.tradeId = -1
                        _this.setState({
                            editItem
                        }, function () {
                            _this.getDatas();
                        })
                    } else {
                        openNotificationWithIcon("error", "错误提示", msg);
                    }
                }
            })
        }
    }

    /**
     * 删除流水明细
     * @param row
     */
    handleDeleteItem = (row) => {
        let _this = this;
        Modal.confirm({
            title: `您确定删除流水明细为:${row.id}的流水吗?`,
            onOk: async () => {
                // 在发请求前, 显示loading
                _this.setState({listLoading: true});
                let para = {
                    id: row.id,
                    tradeId: row.tradeId
                };
                const {msg, code} = await deleteTransactioninfo(para)
                // 在请求完成后, 隐藏loading
                _this.setState({listLoading: false});
                if (code === 0) {
                    openNotificationWithIcon("success", "操作结果", "删除成功");
                    _this.getDatas();
                    _this.resetEditForm()
                } else {
                    openNotificationWithIcon("error", "错误提示", msg);
                }
            }
        })
    }

    /**
     * 初始化页面配置信息
     */
    componentWillMount() {
        // 初始化表格属性设置
        this.initColumns();
    }

    /*
     * 执行异步任务: 发异步ajax请求
     */
    componentDidMount() {
        // 加载页面数据
        let _this = this
        _this.setState({tradeId: _this.props.tradeId}, function () {
            _this.getDatas()
            _this.resetEditForm()
        })
    };


    render() {
        const {datas, dataTotal, nowPage, pageSize, listLoading, editItem} = this.state
        const {getFieldDecorator} = this.props.form;
        return (
            <section>
                <Form layout="inline" style={{marginBottom: '1em'}}>
                    <Form.Item label='出入方式'>
                        {getFieldDecorator('viewAddFlog', {
                            initialValue: '1',
                            rules: [{required: true, message: '请选择出入方式'}],
                        })(
                            <Select suffixIcon={<Icon type="select"/>}
                                    style={{width: 200}}>
                                <Option value="1">存入</Option>
                                <Option value="2">取出</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label='金额'>
                        {getFieldDecorator('viewAddCurrencyNumber', {
                            initialValue: 0,
                            rules: [
                                {required: true, message: '请填写金额'},
                                {max: 12, message: '长度在 12个字符以内'},
                            ],
                        })(
                            <Input
                                prefix={<Icon type="pay-circle"/>}
                                type="number"
                                placeholder="金额"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label='摘要'>
                        {getFieldDecorator('viewAddCurrencyDetails', {
                            rules: [
                                {required: true, message: '请填写摘要'},
                                {min: 2, message: '长度在 2 到 20 个字符'},
                                {max: 20, message: '长度在 2 到 20 个字符'},
                            ],
                        })(
                            <Input
                                prefix={<Icon type="account-book"/>}
                                type="text"
                                placeholder="说明"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="button" onClick={this.handleAddItem}>
                            添加
                        </Button>
                    </Form.Item>
                </Form>
                <Table size="middle" style={{marginBottom: '1em'}} rowKey="id" loading={listLoading}
                       columns={this.columns} dataSource={datas}
                       pagination={{
                           showTotal: () => `当前第${nowPage}页 共${dataTotal}条`,
                           pageSize: pageSize, showQuickJumper: true, total: dataTotal, showSizeChanger: true,
                           onShowSizeChange: (current, pageSize) => this.changePageSize(pageSize, current),
                           onChange: this.changePage,
                       }}/>
                <Form layout="inline" style={{marginBottom: '1em'}}>
                    <Form.Item label='出入方式'>
                        {getFieldDecorator('viewEditFlog', {
                            initialValue: editItem.flog + '',
                            rules: [{required: true, message: '请选择出入方式'}],
                        })(
                            <Select suffixIcon={<Icon type="select"/>}
                                    style={{width: 200}}>
                                <Option value="1">存入</Option>
                                <Option value="2">取出</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label='金额'>
                        {getFieldDecorator('viewEditCurrencyNumber', {
                            initialValue: editItem.currencyNumber,
                            rules: [
                                {required: true, message: '请填写金额'},
                                {max: 12, message: '长度在 12个字符以内'},
                            ],
                        })(
                            <Input
                                prefix={<Icon type="pay-circle"/>}
                                type="number"
                                placeholder="金额"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label='摘要'>
                        {getFieldDecorator('viewEditCurrencyDetails', {
                            initialValue: editItem.currencyDetails,
                            rules: [
                                {required: true, message: '请填写摘要'},
                                {min: 2, message: '长度在 2 到 20 个字符'},
                                {max: 20, message: '长度在 2 到 20 个字符'},
                            ],
                        })(
                            <Input
                                prefix={<Icon type="account-book"/>}
                                type="text"
                                placeholder="说明"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="button" onClick={this.handleEditItem}>
                            修改
                        </Button>
                    </Form.Item>
                </Form>
            </section>
        );
    }
}

// 对外暴露
const WrapViewInfo = Form.create()(ViewInfo)
export default WrapViewInfo;