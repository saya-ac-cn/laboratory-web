import React, {Component} from 'react';
import {Form, Select, Input} from "antd";
import PropTypes from "prop-types";
/*
 * 文件名：editForm.jsx
 * 作者：liunengkai
 * 创建日期：2019-09-01 - 09:59
 * 描述：修改财务申报
 */

// 定义组件（ES6）
class EditForm extends Component {

    /**
     * 设置参数传递是否为空，数据类型等要求属性：
     * @type {{setForm: (*|Validator<NonNullable<T>>|(() => any))}}
     */
    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
        line: PropTypes.object.isRequired,// 要修改的接口信息，用于回显
        type: PropTypes.array,// 父端返回的交易类别
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
        const {line, type} = this.props;
        return (
            <Form {...this.formItemLayout} style={{marginTop: '1.5em'}}>
                <Form.Item label="流水号：" {...this.formItemLayout}>
                    <Input type='text' value={line.tradeId} disabled={true}/>
                </Form.Item>
                <Form.Item label="交易类别：" {...this.formItemLayout}>
                    {
                        getFieldDecorator('updateTradeType', {
                            initialValue: line.tradeType,
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
                        getFieldDecorator('updateTransactionAmount', {
                            initialValue: line.transactionAmount,
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
        );
    }
}

// 对外暴露
const WrapEditForm = Form.create()(EditForm)
export default WrapEditForm;