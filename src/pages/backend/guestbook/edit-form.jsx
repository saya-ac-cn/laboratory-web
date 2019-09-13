import React, {Component} from 'react';
import {Form, Input, Radio} from "antd";
import PropTypes from "prop-types";

/*
 * 文件名：edit-form.jsx
 * 作者：liunengkai
 * 创建日期：2019-08-04 - 17:06
 * 描述：修改留言
 */

// 定义组件（ES6）
class GuestBookEdit extends Component {

    /**
     * 设置参数传递是否为空，数据类型等要求属性：
     * @type {{setForm: (*|Validator<NonNullable<T>>|(() => any))}}
     */
    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
        guest: PropTypes.object.isRequired,// 要修改的接口信息，用于回显
    };

    componentWillMount() {
        this.props.setForm(this.props.form);
        this.formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 14},
        };
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {guest} = this.props;
        return (
            <Form {...this.formItemLayout}>
                <Form.Item label="姓名" {...this.formItemLayout}>
                    <Input disabled={true} value={guest.name}/>
                </Form.Item>
                <Form.Item label="Phone" {...this.formItemLayout}>
                    <Input disabled={true} value={guest.phone}/>
                </Form.Item>
                <Form.Item label="Email" {...this.formItemLayout}>
                    <Input disabled={true} value={guest.email}/>
                </Form.Item>
                <Form.Item label="留言时间" {...this.formItemLayout}>
                    <Input disabled={true} value={guest.createtime}/>
                </Form.Item>
                <Form.Item label="留言内容" {...this.formItemLayout}>
                    <Input.TextArea rows={4} disabled={true} value={guest.content}/>
                </Form.Item>
                <Form.Item label="审核：" {...this.formItemLayout}>
                    {
                        getFieldDecorator('status', {
                            initialValue: 1,
                            rules: [
                                {required: true, message: '请选择接口审核状态'},
                            ]
                        })(
                            <Radio.Group>
                                <Radio value={1}>通过</Radio>
                                <Radio value={4}>不通过</Radio>
                            </Radio.Group>
                        )
                    }
                </Form.Item>
                <Form.Item label="回复内容：" {...this.formItemLayout}>
                    {
                        getFieldDecorator('reply', {
                            initialValue: guest.reply,
                            rules: [
                                {required: true, message: '请输入回复内容'},
                                {min: 1, message: '长度在 1 到 50 个字符'},
                                {max: 140, message: '长度在 1 到 140 个字符'},
                            ]
                        })(
                            <Input.TextArea rows={4} placeholder='请输入回复内容'/>
                        )
                    }
                </Form.Item>
            </Form>
        );
    }

}

// 对外暴露
const WrapGuestBookEdit = Form.create()(GuestBookEdit);
export default WrapGuestBookEdit;