import React, {Component} from 'react';
import {Form, Input, Radio} from 'antd'
import PropTypes from 'prop-types'
/*
 * 文件名：edit-form.jsx
 * 作者：liunengkai
 * 创建日期：2019-07-20 - 18:24
 * 描述：
 */

// 定义组件（ES6）
class EditForm extends Component {

    /**
     * 设置参数传递是否为空，数据类型等要求属性：
     * @type {{setForm: (*|Validator<NonNullable<T>>|(() => any))}}
     */
    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
        api: PropTypes.object.isRequired,// 要修改的接口信息，用于回显
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
        const {api} = this.props;
        return (
            <Form {...this.formItemLayout}>
                <Form.Item label="接口名：" {...this.formItemLayout}>
                    {
                        getFieldDecorator('name', {
                            initialValue: api.name,
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
                            initialValue: api.descript,
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
                            initialValue:api.status,
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
const WrapEditForm = Form.create()(EditForm);
export default WrapEditForm;