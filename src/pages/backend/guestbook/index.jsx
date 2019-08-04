import React, {Component} from 'react';
import {Button, Col, DatePicker, Icon, Input, Table, Form, Select, Modal} from "antd";
import {checkGuestBook, getGuestBookList} from "../../../api";
import {openNotificationWithIcon} from "../../../utils/window";
import moment from "../news";
import GuestBookEdit from "./edit-form"

/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-07-26 - 22:59
 * 描述：留言管理
 */
const {RangePicker} = DatePicker;
const {Option} = Select;
// 定义组件（ES6）
class GuestBook extends Component {

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
            topic: null, // 主题
            name: '', // 姓名
            type: [],// 系统返回的日志类别
            selectType: ''//用户选择的日志类别
        },
        editVisible: false
    };


    /*
    * 初始化Table所有列的数组
    */
    initColumns = () => {
        this.columns = [
            {
                title: '姓名',
                dataIndex: 'name', // 显示数据对应的属性名
            },
            {
                title: '邮箱',
                dataIndex: 'email', // 显示数据对应的属性名
            },
            {
                title: 'Phone',
                dataIndex: 'phone', // 显示数据对应的属性名
            },
            {
                title: '状态',
                render: (text,record) => {
                    if (record.status === 1){
                        return '未审核'
                    } else if (record.status === 2) {
                        return '已通过'
                    } else if (record.status === 3) {
                        return '已屏蔽'
                    } else {
                        return '未知'
                    }
                }
            },
            {
                title: '回复者',
                dataIndex: 'source', // 显示数据对应的属性名
            },
            {
                title: '留言时间',
                dataIndex: 'createtime', // 显示数据对应的属性名
            },
            {
                title: '审核时间',
                dataIndex: 'updatetime', // 显示数据对应的属性名
            },
            {
                title: '管理',
                render: (text, record) => (
                    <div>
                        <Button type="primary" onClick={() => this.handleModalEdit(record)} shape="circle" icon="edit"/>
                    </div>
                ),
            },
        ]
    };

    /**
     * 获取动态列表数据
     * @returns {Promise<void>}
     */
    getDatas = async () => {
        let para = {
            name: this.state.filters.name,
            status: this.state.filters.selectType,
            nowPage: this.state.nowPage,
            pageSize: this.state.pageSize,
            beginTime: this.state.filters.beginTime,
            endTime: this.state.filters.endTime,
        };
        // 在发请求前, 显示loading
        this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getGuestBookList(para);
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
        filters.beginTime = null;
        filters.endTime = null;
        filters.name = null;
        filters.selectType = '';
        _this.setState({
            nowPage: nowPage,
            filters: filters,
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


    /**
     * 双向绑定用户查询主题
     * @param event
     */
    nameInputChange = (event) => {
        let _this = this;
        const value = event.target.value;
        let filters = _this.state.filters;
        filters.name = value;
        _this.setState(filters)
    };

    // 留言状态选框发生改变
    onChangeType = (value) => {
        let _this = this;
        let {filters} = _this.state;
        filters.selectType = value;
        _this.setState({
            filters
        }, function () {
            _this.getDatas()
        });
    };

    /**
     * 初始化留言状态下拉选择
     */
    guestStatus = () => {
        let _this = this;
        let filters = _this.state.filters;
        let type = [
            (<Option key={-1} value="">请选择</Option>),
            (<Option key={1} value="1">未审核</Option>),
            (<Option key={2} value="2">已通过</Option>),
            (<Option key={3} value="3">已屏蔽</Option>)
        ];
        filters.type = type;
        _this.setState({
            filters
        });
    };

    /*
    * 显示修改的弹窗
    */
    handleModalEdit = (value) => {
        this.lineDate = value;
        this.setState({
            editVisible: true
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
            editVisible: false
        })
    };

    /**
     * 修改接口
     */
    handleEditForm = () => {
        let _this = this;
        // 进行表单验证, 只有通过了才处理
        _this.form.validateFields(async (err, values) => {
            if (!err) {
                Modal.confirm({
                    title: '您确定要保存此次修改结果?',
                    onOk: async () => {
                        console.log(values)
                        // 关闭页面表单
                        _this.setState({
                            editVisible: false,
                            listLoading: true
                        });
                        let para = {
                            id: _this.lineDate.id,
                            status: values.status,
                            reply: values.reply
                        };
                        // 清除输入数据
                        _this.form.resetFields();
                        const {msg, code} = await checkGuestBook(para);
                        // 在请求完成后, 隐藏loading
                        _this.setState({listLoading: false});
                        if (code === 0) {
                            openNotificationWithIcon("success", "审核结果", "审核成功");
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
        this.guestStatus();
    };


    render() {
        // 读取状态数据
        const {datas, dataTotal, nowPage, pageSize, listLoading,filters,editVisible} = this.state;
        let {beginTime,endTime,name} = filters;
        let rangeDate;
        if (beginTime !== null && endTime !== null){
            rangeDate = [moment(beginTime),moment(endTime)]
        } else {
            rangeDate = [null,null]
        }
        // 读取所选中的行数据
        const guest = this.lineDate || {}; // 如果还没有指定一个空对象
        return (
            <section>
                <Col span={24} className="toolbar">
                    <Form layout="inline">
                        <Form.Item>
                            <Select value={filters.selectType} className="queur-type" onChange={this.onChangeType}
                                    placeholder="请选择留言状态">
                                {filters.type}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Input type='text' value={name} onChange={this.nameInputChange}
                                   placeholder='按主题检索'/>
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
                <Modal
                    width="60%"
                    title="回复留言"
                    onCancel={this.handleModalCancel}
                    onOk={this.handleEditForm}
                    visible={editVisible === true}>
                    <GuestBookEdit guest={guest} setForm={(form) => {
                        this.form = form
                    }}/>
                </Modal>
            </section>
        );
    }
}

// 对外暴露
export default GuestBook;