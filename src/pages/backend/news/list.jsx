import React, {Component} from 'react';
import {Button, Col, Icon, Table, DatePicker, Input, Form} from "antd";
import {getNewsList} from "../../../api";
import {openNotificationWithIcon} from "../../../utils/window";
import moment from 'moment';
/*
 * 文件名：list.jsx
 * 作者：liunengkai
 * 创建日期：2019-07-24 - 22:28
 * 描述：动态管理页面
 */
const {RangePicker} = DatePicker;
// 定义组件（ES6）
class List extends Component {

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
            topic: null // 主题
        },
    };

    /*
    * 初始化Table所有列的数组
    */
    initColumns = () => {
        this.columns = [
            {
                title: '作者',
                dataIndex: 'source', // 显示数据对应的属性名
            },
            {
                title: '标题',
                dataIndex: 'topic', // 显示数据对应的属性名
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
                        <Button type="primary" shape="circle" icon="edit"/>
                        &nbsp;
                        <Button type="danger"  shape="circle" icon="delete"/>
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
            topic: this.state.filters.topic,
            nowPage: this.state.nowPage,
            pageSize: this.state.pageSize,
            beginTime: this.state.filters.beginTime,
            endTime: this.state.filters.endTime,
        };
        // 在发请求前, 显示loading
        this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getNewsList(para);
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
        filters.topic = null;
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
    topicInputChange = (event) => {
        let _this = this;
        const value = event.target.value;
        let filters = _this.state.filters;
        filters.topic = value;
        _this.setState(filters)
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
        let {beginTime,endTime,topic} = filters;
        let rangeDate;
        if (beginTime !== null && endTime !== null){
            rangeDate = [moment(beginTime),moment(endTime)]
        } else {
            rangeDate = [null,null]
        }
        return (
            <section>
                <Col span={24} className="toolbar">
                    <Form layout="inline">
                        <Form.Item>
                            <Input type='text' value={topic} onChange={this.topicInputChange}
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
            </section>
        );
    }
}

// 对外暴露
export default List;