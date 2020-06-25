import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Form, Input} from "antd";
/*
 * 文件名：edit.jsx
 * 作者：liunengkai
 * 创建日期：2019-08-25 - 21:50
 * 描述：便利贴表单
 */

// 定义组件（ES6）
class EditMemo extends Component {

    /**
     * 设置参数传递是否为空，数据类型等要求属性：
     * @type {{setForm: (*|Validator<NonNullable<T>>|(() => any))}}
     */
    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
        memo: PropTypes.object,// 要修改的接口信息，用于回显
    };


    constructor(props) {
        super(props);
        this.state = {
            memo: {}, // 创建一个没有内容的编辑对象
            enitNum:this.props.enitNum || 1,// 已直接初始化
        };
    }

    /**
     * 在组件接收新props时调用。初始渲染不调用此方法
     * @param data
     * 子父组件传值问题：https://www.jianshu.com/p/713206e571cf
     */
    componentDidUpdate(props) {
        let _this = this;
        if (true === _this.isEmptyObject(props.memo) && true === _this.isEmptyObject(_this.props.memo)){
            // 都为空，不更新
            return
        }else {
            // 存在一边为空
            //console.log(props.memo,_this.props.memo)
            // _this.props.memo 才是本次打开显示的数据
            if (false === this.isEmptyObject(_this.props.memo) && 1 === _this.state.enitNum){
                //console.log("更新就绪",_this.props)
                this.setState({
                    memo:_this.props.memo,
                    enitNum:0 // 初始化完毕
                })
                // this.state ={
                //     memo:_this.props.memo
                // }
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            enitNum:nextProps.enitNum
        });
    }

    /**
     * 判断对象是否为空
     * @param data
     * @returns {boolean}
     */
    isEmptyObject = (data) => {
        // 手写实现的判断一个对象{}是否为空对象，没有任何属性 非空返回false
        var item;
        for (item in data)
            return false;
        return true;
    }

    componentWillMount() {
        this.props.setForm(this.props.form);
        this.formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 14},
        };
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const memo = !this.isEmptyObject(this.state.memo)? this.state.memo : this.props.memo
        return (
            <Form {...this.formItemLayout}>
                <Form.Item label="标题名：" {...this.formItemLayout}>
                    {
                        getFieldDecorator('title', {
                            initialValue: memo.title,
                            rules: [
                                {required: true, message: '请输入便利贴标题'},
                                {min: 2, message: '长度在 2 到 15 个字符'},
                                {max: 15, message: '长度在 2 到 15 个字符'},
                            ]
                        })(
                            <Input placeholder='请输入标题'/>
                        )
                    }
                </Form.Item>
                <Form.Item label="正文：" {...this.formItemLayout}>
                    {
                        getFieldDecorator('content', {
                            initialValue: memo.content,
                            rules: [
                                {required: true, message: '请输入便利贴正文'},
                                {max: 128, message: '长度在 1 到 128 个字符'},
                            ]
                        })(
                            <Input.TextArea rows={3} placeholder='请输入便利贴正文'/>
                        )
                    }
                </Form.Item>
            </Form>
        );
    }
}

// 对外暴露
const WrapEditEditMemo = Form.create()(EditMemo)
export default WrapEditEditMemo;