import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Row, Col, Form, Input, Card, Select, Button, Icon} from "antd";

/*
 * 文件名：addForm.jsx
 * 作者：liunengkai
 * 创建日期：2019-08-29 - 21:50
 * 描述：财务申报
 */

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
        form:{
            tradeType:1,
            transactionAmount:'',
            infoList:[{
                flog:2,
                currencyNumber:0,
                currencyDetails:''
            }]
        }
    }

    // 继续添加财政明细
    continueAdd = () => {
        let form = this.state.form
        let item = {
            flog:2,
            currencyNumber:0,
            currencyDetails:''
        }
        form.infoList.push(item);
        this.setState({form})
        return false;
    }


    componentWillMount() {
        this.props.setForm(this.props.form);
        this.formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 12},
        };
    }


    render() {
        const {tradeType,transactionAmount,infoList} = this.state.form
        const {type} = this.props;
        const { getFieldDecorator } = this.props.form;
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
                <Form {...this.formItemLayout}>
                    <Form.Item label="交易类别：" {...this.formItemLayout}>
                        {
                            getFieldDecorator('tradeType', {
                                initialValue: tradeType,
                                rules: [
                                    {required: true, message: '请选择交易类别'}
                                ]
                            })(
                                <Select style={{width:'200px'}} showSearch onChange={this.onChangeType}
                                        allowClear={true}  placeholder="请选择交易类别">
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
                <Row style={{display: 'flex',alignItems: 'center',justifyItems: 'center',marginBottom:'1em'}}>
                    <Col span={4} style={{textAlign:'right',display: 'flex',alignContent: 'center',justifyContent: 'flex-end'}}>
                        <div>流水1：</div>
                    </Col>
                    <Col span={18}>
                        <div>
                            <Form layout="inline">
                                <Form.Item>
                                    {getFieldDecorator('username', {
                                        rules: [{ required: true, message: 'Please input your username!' }],
                                    })(
                                        <Input
                                            prefix={<Icon type="user" />}
                                            placeholder="Username"
                                        />,
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('password', {
                                        rules: [{ required: true, message: 'Please input your Password!' }],
                                    })(
                                        <Input
                                            prefix={<Icon type="lock" />}
                                            type="password"
                                            placeholder="Password"
                                        />,
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('password2', {
                                        rules: [{ required: true, message: 'Please input your Password!' }],
                                    })(
                                        <Input
                                            prefix={<Icon type="lock" />}
                                            type="password"
                                            placeholder="Password"
                                        />,
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Log in
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                </Row>
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