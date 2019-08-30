import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Row, Col, Form, Input, Select, Button, Icon} from "antd";
import {openNotificationWithIcon} from "../../../utils/window";

/*
 * 文件名：addForm.jsx
 * 作者：liunengkai
 * 创建日期：2019-08-29 - 21:50
 * 描述：财务申报
 */
const {Option} = Select;

// 定义组件（ES6）
class AddForm extends Component {

    /**
     * 设置参数传递是否为空，数据类型等要求属性：
     * @type {{setForm: (*|Validator<NonNullable<T>>|(() => any))}}
     */
    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
        type: PropTypes.array,// 父端返回的交易类别
    };

    state = {
        form: {
            tradeType: 1,
            transactionAmount: '',
            infoList: [{
                flog: 1,
                currencyNumber: 0,
                currencyDetails: ''
            }]
        }
    }

    // 继续添加财政明细
    continueAdd = () => {
        let form = this.state.form
        let item = {
            flog: 1,
            currencyNumber: 0,
            currencyDetails: ''
        }
        form.infoList.push(item);
        this.setState({form})
        return false;
    }

    // 删除明细添加行
    deleteLine = (index) => {
        let _this = this
        let form = _this.state.form
        console.log(index,form.infoList)
        if(form.infoList.length <= 1){
            openNotificationWithIcon("error", "错误提示", '每一笔流水申请下边必须要有一条详情记录');
        }else{
            form.infoList.splice(index,1);
            _this.setState({form},function () {
                console.log(_this.state.form.infoList)
            })
        }
    }

    /**
     * 双向绑定用户查询主题
     * @param event
     */
    onChangeDate = (event) => {
        let _this = this;
        const value = event.target.value;
        let form = _this.state.form;
        let currencyNumber =  event.currentTarget.getAttribute('data-currencynumber')
        form.infoList[currencyNumber].currencyNumber = value
        _this.setState({form})
    };


    componentWillMount() {
        this.props.setForm(this.props.form);
        this.formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 12},
        };
    }


    render() {
        const {tradeType, transactionAmount, infoList} = this.state.form
        const {type} = this.props;
        const {getFieldDecorator} = this.props.form;
        let _this = this
        return (
            <section>
                <div className="mytips">
                    <p>财政申报约定：</p>
                    <blockquote>
                        <p>
                            <i>1、同一天可以申报多次。</i>
                        </p>
                        <p>
                            <i>2、同一笔流水申请只能对应一种支付方式。</i>
                        </p>
                        <p>
                            <i>3、一笔流水下面必须有一条流水明细。</i>
                        </p>
                    </blockquote>
                </div>
                <Form {...this.formItemLayout} style={{marginTop: '1.5em'}}>
                    <Form.Item label="交易类别：" {...this.formItemLayout}>
                        {
                            getFieldDecorator('tradeType', {
                                initialValue: tradeType,
                                rules: [
                                    {required: true, message: '请选择交易类别'}
                                ]
                            })(
                                <Select style={{width: '200px'}} showSearch onChange={this.onChangeType}
                                        allowClear={true} placeholder="请选择交易类别">
                                    {type}
                                </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item label="交易摘要：" {...this.formItemLayout}>
                        {
                            getFieldDecorator('transactionAmount', {
                                initialValue: transactionAmount,
                                rules: [
                                    {required: true, message: '请输入交易摘要'},
                                    {min: 2, message: '长度在 2 到 15 个字符'},
                                    {max: 15, message: '长度在 2 到 15 个字符'},
                                ]
                            })(
                                <Input.TextArea rows={2} placeholder='请输入交易摘要'/>
                            )
                        }
                    </Form.Item>
                </Form>
                {
                    infoList.map(function (item,index) {
                        return (
                            <Row key={index} style={{display: 'flex', alignItems: 'center', justifyItems: 'center', marginBottom: '1em'}}>
                                <Col span={4} style={{
                                    textAlign: 'right',
                                    display: 'flex',
                                    alignContent: 'center',
                                    justifyContent: 'flex-end'
                                }}>
                                    <div>流水{(index+1)}：</div>
                                </Col>
                                <Col span={18}>
                                    <div>
                                        <Form layout="inline">
                                            <Form.Item>
                                                {getFieldDecorator("flog"+index, {
                                                    initialValue: item.flog+'',
                                                    rules: [{required: true, message: '请选择出入方式'}],
                                                })(
                                                    <Select suffixIcon={<Icon type="select"/>}
                                                            style={{width: 100}}>
                                                        <Option value="1">存入</Option>
                                                        <Option value="2">取出</Option>
                                                    </Select>
                                                )}
                                            </Form.Item>
                                            <Form.Item>
                                                {getFieldDecorator('currencyNumber'+index, {
                                                    initialValue: item.currencyNumber,

                                                    rules: [
                                                        {required: true, message: '请填写金额'},
                                                        {max: 12, message: '长度在 12个字符以内'},
                                                    ],
                                                })(
                                                    <Input
                                                        prefix={<Icon type="pay-circle"/>}
                                                        type="number"
                                                        data-currencynumber={index}
                                                        onChange={_this.onChangeDate}
                                                        placeholder="金额"
                                                    />,
                                                )}
                                            </Form.Item>
                                            <Form.Item>
                                                {getFieldDecorator('currencyDetails'+index, {
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
                                                <Button type="primary" htmlType="button" onClick={()=>_this.deleteLine(index)}>
                                                    删除{index}
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </div>
                                </Col>
                            </Row>
                        )
                    })
                }
                <Row>
                    <Col offset={4} span={18}>
                        <Button type="primary" htmlType="button" onClick={this.continueAdd}>
                            <Icon type="plus"/>继续添加
                        </Button>
                    </Col>
                </Row>
            </section>
        );
    }
}

// 对外暴露
const WrapAddForm = Form.create()(AddForm)
export default WrapAddForm;