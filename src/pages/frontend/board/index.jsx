import React, {Component} from 'react';
import DocumentTitle from 'react-document-title'
import './index.less'
import {Button, Input, Form, Spin} from "antd";
import {writeboard} from "../../../api";
import {openNotificationWithIcon} from "../../../utils/window";
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-09-12 - 22:17
 * 描述：留言板
 */

// 定义组件（ES6）
class Board extends Component {

    state = {
        // 添加界面数据
        addForm: {
            name: '',
            phone: '',
            email: '',
            content: ''
        },
        loading: false
    }

    /**
     * 验证Phone
     * @param rule
     * @param value
     * @param callback
     */
    validatePhone = (rule, value, callback) => {
        if (!/^1[0-9]{10}$/.test(value)) {
            callback('Phone格式有误')
        } else {
            callback() // 验证通过
        }
        // callback('xxxx') // 验证失败, 并指定提示的文本
    };

    /**
     * 验证邮箱
     * @param rule
     * @param value
     * @param callback
     */
    validateEmail = (rule, value, callback) => {
        if (!/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(value)) {
            callback('Email格式有误')
        } else {
            callback() // 验证通过
        }
        // callback('xxxx') // 验证失败, 并指定提示的文本
    };

    /**
     * 保存提交
     * @param e
     */
    handleSubmit = (e) => {
        // 阻止表单的默认提交
        e.preventDefault();
        let _this = this
        _this.props.form.validateFields(['name', 'phone', 'email', 'content'], async (err, values) => {
            if (!err) {
                _this.setState({loading: true});
                let para = {
                    name: values.name.trim(),
                    phone: values.phone.trim(),
                    email: values.email.trim(),
                    content: values.content.trim()
                }
                const {msg, code} = await writeboard(para)
                _this.setState({loading: false});
                if (code === 0) {
                    _this.props.form.resetFields(['name', 'phone', 'email', 'content'])
                    openNotificationWithIcon("success", "操作结果", "感谢您的留言，我们收到后将及时回复您。");
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
        this.formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 14},
        };
        this.buttonItemLayout = {
            wrapperCol: {span: 14, offset: 4},
        };
    };


    render() {
        const form = this.props.form;
        const {getFieldDecorator} = form;
        const {addForm, loading} = this.state;
        return (
            <DocumentTitle title="留言反馈">
                <div className="base-content">
                    <div className="child-container">
                        <div className="menu-title">
                            <div className="menu-name">
                                留言反馈
                            </div>
                        </div>
                        <div className='form-div'>
                            <div className="envelope" style={{'background': `rgba(255, 255, 255, 0) url('${process.env.PUBLIC_URL}/picture/svg/envolope.svg') repeat-x`}}></div>
                            <Spin spinning={loading}>
                                <Form {...this.formItemLayout} onSubmit={this.handleSubmit}>
                                    <Form.Item label="姓名" {...this.formItemLayout}>
                                        {
                                            getFieldDecorator('name', {
                                                initialValue: addForm.name,
                                                rules: [
                                                    {required: true, message: '请输入个性签名'},
                                                    {max: 30, message: '您的名字太长了吧，30个字符以内'},
                                                ]
                                            })(<Input size="large"/>)
                                        }
                                    </Form.Item>
                                    <Form.Item label="Phone" {...this.formItemLayout}>
                                        {
                                            getFieldDecorator('phone', {
                                                initialValue: addForm.phone,
                                                rules: [
                                                    {required: true, message: '请输入Phone'},
                                                    {validator: this.validatePhone},
                                                ]
                                            })(<Input size="large"/>)
                                        }
                                    </Form.Item>
                                    <Form.Item label="Email" {...this.formItemLayout}>
                                        {
                                            getFieldDecorator('email', {
                                                initialValue: addForm.email,
                                                rules: [
                                                    {required: true, message: '请输入Email'},
                                                    {validator: this.validateEmail},
                                                ]
                                            })(<Input size="large"/>)
                                        }
                                    </Form.Item>
                                    <Form.Item label="内容" {...this.formItemLayout}>
                                        {
                                            getFieldDecorator('content', {
                                                initialValue: addForm.content,
                                                rules: [
                                                    {required: true, message: '请输入留言内容'},
                                                    {max: 140, message: '长度在140 个字符以内'},
                                                ]
                                            })(<Input.TextArea autosize={{minRows: 4, maxRows: 6}}/>)
                                        }
                                    </Form.Item>
                                    <Form.Item {...this.buttonItemLayout}>
                                        <Button size="large" type="primary" htmlType="submit">提交</Button>
                                    </Form.Item>
                                </Form>
                            </Spin>
                            <div className="envelope" style={{'background': `rgba(255, 255, 255, 0) url('${process.env.PUBLIC_URL}/picture/svg/envolope.svg') repeat-x`}}></div>
                        </div>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}

// 对外暴露
const WarpBoard = Form.create()(Board)
export default WarpBoard;