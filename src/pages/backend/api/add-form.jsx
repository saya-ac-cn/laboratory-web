import React, {Component} from 'react';
import {Form, Input, Radio} from 'antd'
import PropTypes from 'prop-types'
/*
 * 文件名：add-form.jsx
 * 作者：liunengkai
 * 创建日期：2019-07-20 - 18:24
 * 描述：
 */

// 定义组件（ES6）
class AddForm extends Component {

    /**
     * 设置参数传递是否为空，数据类型等要求属性：
     * @type {{setForm: (*|Validator<NonNullable<T>>|(() => any))}}
     */
    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
    };

    componentWillMount () {
        this.props.setForm(this.props.form);
        this.formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 14},
        };
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form {...this.formItemLayout}>
                <Form.Item label="接口名：" {...this.formItemLayout}>
                    {
                        getFieldDecorator('name', {
                            initialValue: '',
                            rules: [
                                {required: true, message: '请输入接口名'},
                                {min: 2, message: '长度在 2 到 15 个字符'},
                                {max: 15, message: '长度在 2 到 15 个字符'},
                            ]
                        })(
                            <Input placeholder='请输入接口名'/>
                        )
                    }
                </Form.Item>
                <Form.Item label="接口描述：" {...this.formItemLayout}>
                    {
                        getFieldDecorator('descript', {
                            initialValue: '',
                            rules: [
                                {required: true, message: '请输入接口描述'},
                                {min: 1, message: '长度在 1 到 50 个字符'},
                                {max: 50, message: '长度在 1 到 50 个字符'},
                            ]
                        })(
                            <Input placeholder='请输入接口描述'/>
                        )
                    }
                </Form.Item>
                <Form.Item label="是否开启：" {...this.formItemLayout}>
                    {
                        getFieldDecorator('status', {
                            initialValue:1,
                            rules: [
                                {required: true, message: '请选择接口开启状态'},
                            ]
                        })(
                            <Radio.Group>
                                <Radio value={1}>开启</Radio>
                                <Radio value={2}>关闭</Radio>
                            </Radio.Group>
                        )
                    }
                </Form.Item>
            </Form>
        );
    }
}

// 对外暴露
const WrapAddForm = Form.create()(AddForm);
export default WrapAddForm;