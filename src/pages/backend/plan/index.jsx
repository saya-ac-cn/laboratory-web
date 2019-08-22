import React, {Component} from 'react';
import {Button, Col, DatePicker, Icon, Form, Row, Modal, Input, Spin, Popconfirm} from "antd";
import DocumentTitle from 'react-document-title'
import './index.less'
import {getPlanList, createPlan, updatePlan, deletePlan} from "../../../api";
import {openNotificationWithIcon} from "../../../utils/window";
import moment from 'moment';
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-08-19 - 22:36
 * 描述：计划管理
 */

// 定义组件（ES6）
class Plan extends Component {

    state = {
        listLoading: false,
        datas:[],
        outhtml:[],
        filters: {
            date: ""
        },
        formVisible: false,
        //编辑界面数据
        editForm: {
            id: '',
            planDate: '',
            planContent: '',
        },
    }

    /**
     * 获取计划列表数据
     * @returns {Promise<void>}
     */
    getDatas = async () => {
        let _this = this
        let filters = _this.state.filters
        let para = {
            date: filters.date,
        };
        // 在发请求前, 显示loading
        _this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getPlanList(para);
        // 在请求完成后, 隐藏loading
        _this.setState({listLoading: false});
        if (code === 0) {
            // 表格数据
            _this.setState({datas: data},function () {
                _this.rendering()
            });
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    };

    rendering = () => {
        var isNowMonth = true;
        // 判断是否是本月
        var nowDate = new Date(this.getNowFormatDate());
        var nowYear = nowDate.getFullYear()//获取年
        var nowMonth = nowDate.getMonth();//获取月
        var nowday = nowDate.getDate();//获取天数
        var localDate = new Date(this.state.filters.date);
        var localYear = localDate.getFullYear()//获取年
        var localMonth = localDate.getMonth();//获取月
        var editDate = localYear + '-' + (localMonth+1) + '-'
        if((nowYear === localYear)&&(nowMonth === localMonth)){
            isNowMonth = true
        } else {
            isNowMonth = false
        }
        // 开始渲染
        var outhtml = [];//输出具体的日历
        var _thisLine = [];//处理的每一行
        var lineNum = 0;//行号
        for(var i = 0;i < this.state.datas.length;i++){
            const item = this.state.datas[i]
            const cellNum = i % 7
            if(cellNum === 0){
                // 行开始
                _thisLine = []
                lineNum++
            }
            if(item.flog === 1){
                // 需要渲染日历
                // 判断该天有无安排计划
                if(item.value === 0){
                    // 没有安排计划
                    // 判断当前单元格是否是今天
                    if(isNowMonth === true && nowday === item.number){
                        _thisLine.push(<td key={i} onClick={this.clickTD} data-id={item.id} data-key={editDate+item.number} className="today">{item.number}</td>)
                    }else {
                        _thisLine.push(<td key={i} onClick={this.clickTD} data-id={item.id} data-key={editDate+item.number}>{item.number}</td>)
                    }
                }else{
                    // 有计划
                    _thisLine.push(<td key={i} onClick={this.clickTD} className="havetoday" data-id={item.id} data-key={editDate+item.number} data-value={item.value}>{item.number}</td>)
                }
            }else{
                // 显示1号前和月尾的空白单元格
                _thisLine.push(<td key={i}></td>)
            }
            if(cellNum === 6){
                outhtml.push(<tr key={lineNum}>{_thisLine}</tr>)
            }
        }
        this.setState({
            outhtml
        })
    };

    /**
     * 获取当前日期
     * @returns {string}
     */
    getNowFormatDate = () => {
        var date = new Date()
        var seperator1 = '-'
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var strDate = date.getDate()
        if (month >= 1 && month <= 9) {
            month = '0' + month
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = '0' + strDate
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate
    };

    // 日期选择发生变化
    onChangeDate = (date, dateString) => {
        let _this = this
        let filters = _this.state.filters
        if (dateString === '' || JSON.stringify(dateString) === null || JSON.stringify(dateString) === 'null'){
            filters.date = this.getNowFormatDate()
        }else {
            filters.date = dateString
        }
        _this.setState({
            filters
        },function () {
            _this.getDatas()
        })
    }

    /**
     * 日期加减运算
     * @param _dateObject
     * @param x
     * @returns {string}
     */
    getOperationData = (_dateObject,x) => {
        //运算日期
        if( _dateObject === null || undefined === _dateObject || _dateObject === ''){
            _dateObject = new Date();
        }
        _dateObject.setMonth(_dateObject.getMonth() + x);
        var nd = _dateObject.valueOf() ;
        nd = new Date(nd);
        var y = nd.getFullYear();
        var m = nd.getMonth() + 1;
        var d = nd.getDate();
        if(m <= 9) m = '0' + m;
        if(d <= 9) d = '0'+ d;
        var cdate = y + '-' + m + '-01' ;
        return cdate;
    }

    /**
     * 日期加减事件
     * @param flog
     */
    buttonQuery = (flog) =>{
        let _this = this
        // 通过上一个月，下一个月进行日期查询
        let filters = _this.state.filters
        filters.date = _this.getOperationData(new Date(filters.date),flog)
        _this.setState({filters},function () {
            _this.getDatas()
        })
    };

    /**
     * 单击单元格事件
     * @param e
     */
    clickTD = (e) => {
        let _this = this;
        // 得到自定义属性
        // 得到计划的主键，没有计划时为-1
        let id =  e.currentTarget.getAttribute('data-id')
        // 得到当天的时间
        let key =  e.currentTarget.getAttribute('data-key')
        let {formVisible, editForm} = _this.state
        formVisible = true
        if (id === -1 || id === '-1'){
            // 该天无计划
            editForm.planDate = key
            editForm.planContent = null
            editForm.id = null
        } else {
            // 该天有计划
            let value =  e.currentTarget.getAttribute('data-value')
            editForm.planContent = value
            editForm.planDate = key
            editForm.id = id
        }
        _this.setState({
            formVisible:formVisible,
            editForm:editForm
        })
    };

    /**
     * 关闭计划弹窗
     */
    handleCloseForm = () => {
        let _this = this;
        let formVisible = false;
        _this.setState({
            formVisible:formVisible
        })
    };

    /**
     * 提交修改
     */
    handleSubmitForm = () => {
        let _this = this;
        let form = _this.state.editForm
        _this.props.form.validateFields( (err, values) => {
            // 通过验证
            if (!err) {
                form.planContent = values.planContent
                if (form.id === null){
                    // 提交到创建接口
                    _this.sendInsertRequest(form)
                } else {
                    // 提交到修改接口
                    _this.sendUpdateRequest(form)
                }
            }
        })
    };

    /**
     * 发送添加请求
     * @param form
     * @returns {Promise<void>}
     */
    sendInsertRequest = async (form) => {
        let _this = this;
        let para = {
            describe: form.planContent,
            plandate: form.planDate
        };
        // 在发请求前, 显示loading
        _this.setState({listLoading: true});
        const {msg, code} = await createPlan(para)
        // 在请求完成后, 隐藏loading
        _this.setState({listLoading: false});
        if (code === 0) {
            openNotificationWithIcon("success", "操作结果", "创建成功");
            _this.handleCloseForm()
            _this.props.form.resetFields()
            _this.getDatas();
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    };

    sendUpdateRequest = async (form) => {
        let _this = this;
        let para = {
            id: form.id,
            describe:form.planContent,
            plandate: form.planDate
        };
        // 在发请求前, 显示loading
        _this.setState({listLoading: true});
        const {msg, code} = await updatePlan(para)
        // 在请求完成后, 隐藏loading
        _this.setState({listLoading: false});
        if (code === 0) {
            openNotificationWithIcon("success", "操作结果", "修改成功");
            _this.handleCloseForm()
            _this.props.form.resetFields()
            _this.getDatas();
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    };

    /**
     * 删除计划
     * @param e
     */
    handleDeletePlan = async (e) =>{
        let _this = this;
        let editForm = _this.state.editForm
        let para = {
            id: editForm.id
        };
        // 在发请求前, 显示loading
        _this.setState({listLoading: true});
        const {msg, code} = await deletePlan(para)
        // 在请求完成后, 隐藏loading
        _this.setState({listLoading: false});
        if (code === 0) {
            openNotificationWithIcon("success", "操作结果", "删除成功");
            _this.handleCloseForm()
            _this.props.form.resetFields()
            _this.getDatas();
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    }

    /*
     * 为第一次render()准备数据
     * 因为要异步加载数据，所以方法改为async执行
     */
    componentWillMount() {
        let filters = this.state.filters
        filters.date = this.getNowFormatDate()
        this.setState({
            filters
        })
        this.formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 14},
        };
        this.buttonItemLayout = {
            wrapperCol: {span: 14, offset: 4},
        };
    }

    /*
    执行异步任务: 发异步ajax请求
    */
    componentDidMount() {
        // 加载页面数据
        this.getDatas();
    };


    render() {
        const {formVisible, editForm, listLoading} = this.state;
        const {date} = this.state.filters;
        const outhtml = this.state.outhtml
        const {getFieldDecorator} = this.props.form;
        return (
            <DocumentTitle title="日程安排">
                <section>
                    <Modal
                        title="计划安排"
                        width="50%"
                        visible={formVisible === true}
                        okText='提交'
                        onOk={this.handleSubmitForm}
                        onCancel={this.handleCloseForm}>
                        <Form {...this.formItemLayout}>
                            <Form.Item label="计划时间" {...this.formItemLayout}>
                                <Input disabled={true} value={editForm.planDate}/>
                            </Form.Item>
                            <Form.Item label="计划内容：" {...this.formItemLayout}>
                                {
                                    getFieldDecorator('planContent', {
                                        initialValue: editForm.planContent,
                                        rules: [
                                            {required: true, message: '请输入计划内容'},
                                            {min: 1, message: '长度在 1 到 50 个字符'},
                                            {max: 140, message: '长度在 1 到 140 个字符'},
                                        ]
                                    })(
                                        <Input.TextArea rows={4} placeholder='请输入计划内容'/>
                                    )
                                }
                            </Form.Item>
                            {
                                !!editForm.id &&
                                <Form.Item {...this.buttonItemLayout}>
                                    <Popconfirm
                                        title="您确定要删除该计划?"
                                        onConfirm={this.handleDeletePlan}
                                        okText="确定"
                                        cancelText="取消"
                                    >
                                        <Button type="link">删除计划</Button>
                                    </Popconfirm>
                                </Form.Item>
                            }
                        </Form>
                    </Modal>
                    <Row>
                        <Col span={24} className="toolbar">
                            <Form layout="inline">
                                <Form.Item>
                                    <DatePicker defaultValue={moment(date, 'YYYY-MM-DD')} onChange={this.onChangeDate}/>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <div
                                style={{float: 'left',width: '30%',height: '100%',textAlign: 'left',lineHeight: '45px',cursor: 'pointer'}}>
                                <span onClick={() => this.buttonQuery(-1)}><Icon type="left" /></span>
                            </div>
                            <div
                                style={{float: 'left',width: '40%',height: '100%',textAlign: 'center',lineHeight: '45px',fontSize: '20px'}}>
                                {date}
                            </div>
                            <div
                                style={{float: 'right',width: '28%',height: '100%',textAlign: 'right',lineHeight: '45px',cursor: 'pointer'}}>
                                <span onClick={() => this.buttonQuery(+1)}><Icon type="right" /></span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            {listLoading === true ? <Spin/> :
                            <table id="plantanle" border="1px" cellPadding="0" cellSpacing="0">
                                <thead>
                                <tr>
                                    <td>星期日</td>
                                    <td>星期一</td>
                                    <td>星期二</td>
                                    <td>星期三</td>
                                    <td>星期四</td>
                                    <td>星期五</td>
                                    <td>星期六</td>
                                </tr>
                                </thead>
                                <tbody>
                                {outhtml}
                                </tbody>
                            </table>
                            }
                        </Col>
                    </Row>
                </section>
            </DocumentTitle>
        )
    }
}

// 对外暴露
const WrapPlan = Form.create()(Plan)
export default WrapPlan;