import React, {Component} from 'react';
import {Col, Tabs, Card, Form, Input, Button, Spin} from 'antd';
import {getPersonal, setPassword, setUserInfo} from "../../../api";
import {openNotificationWithIcon} from "../../../utils/window";
import UploadLogo from './uploadLogo'

const {TabPane} = Tabs;
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-07-14 - 17:30
 * 描述：个人信息管理
 */

// 定义组件（ES6）
class Info extends Component {

    state = {
        // 返回的个人数据
        personalInfo: {},
        // 页面加载中
        loading: false,
    };

    /**
     * 获取日志类别
     * @returns {Promise<void>}
     */
    getPersonalInfo = async () => {
        let _this = this;
        // 在发请求前, 显示loading
        _this.setState({loading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getPersonal();
        // 在请求完成后, 隐藏loading
        _this.setState({loading: false});
        if (code === 0) {
            _this.setState({
                personalInfo: data
            })
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    };

    /*
    *对密码进行自定义验证
    */
    /*
      用户名/密码的的合法性要求
      1). 必须输入
      2). 必须大于等于6位
      3). 必须小于等于20位
      4). 必须是英文、数字或下划线组成
    */
    validatePwd1 = (rule, value, callback) => {
        // console.log(this.props.form.getFieldValue('password'));
        // this.props.form.setFieldsValue({
        //     password:1111111
        // })
        if (!value) {
            callback('密码必须输入')
        } else if (value.length < 6) {
            callback('密码长度不能小于6位')
        } else if (value.length > 20) {
            callback('密码长度不能大于20位')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback('密码必须是英文、数字或下划线组成')
        } else {
            callback() // 验证通过
        }
        // callback('xxxx') // 验证失败, 并指定提示的文本
    };

    validatePwd2 = (rule, value, callback) => {
        // 提取第一个密码框的值
        const password = this.props.form.getFieldValue('password1');
        console.log(password)
        if (!value) {
            callback('密码必须输入')
        } else if (value.length < 6) {
            callback('密码长度不能小于6位')
        } else if (value.length > 20) {
            callback('密码长度不能大于20位')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback('密码必须是英文、数字或下划线组成')
        } else if (value !== password) {
            callback('您两次输入的密码不一致')
        } else {
            callback() // 验证通过
        }
    };

    // 提交修改密码表单
    handlePwdSubmit = (e) => {
        let _this = this;
        // 阻止表单的默认提交
        e.preventDefault();
        this.props.form.validateFields(['password1', 'password2'], async (err, values) => {
            // 通过验证
            if (!err) {
                // 在发请求前, 显示loading
                _this.setState({loading: true});
                let para = {
                    password: values.password2
                };
                const result = await setPassword(para);
                // 在请求完成后, 隐藏loading
                _this.setState({loading: false});
                let {msg, code} = result;
                if (code === 0) {
                    openNotificationWithIcon("success", "操作结果", "密码修改成功");
                } else {
                    openNotificationWithIcon("error", "错误提示", msg);
                }
            } else {
                console.log('form check fail: ', values);
            }
        });
    };

    // 提交修改个性签名表单
    handleAutographSubmit = (e) => {
        let _this = this;
        // 阻止表单的默认提交
        e.preventDefault();
        this.props.form.validateFields(['autograph'], async (err, values) => {
            // 通过验证
            if (!err) {
                // 在发请求前, 显示loading
                _this.setState({loading: true});
                let para = {
                    autograph: values.autograph
                };
                const result = await setUserInfo(para);
                // 在请求完成后, 隐藏loading
                _this.setState({loading: false});
                let {msg, code} = result;
                if (code === 0) {
                    openNotificationWithIcon("success", "操作结果", "个性签名修改成功");
                } else {
                    openNotificationWithIcon("error", "错误提示", msg);
                }
            } else {
                console.log('form check fail: ', values);
            }
        });
    };

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

    /*
    执行异步任务: 发异步ajax请求
    */
    componentDidMount() {
        this.getPersonalInfo()
    }


    render() {
        const form = this.props.form;
        const {getFieldDecorator} = form;
        // 读取状态数据
        const {personalInfo, loading} = this.state;
        return (
            <section>
                <div className="mytips">
                    <p>修改前的提示：</p>
                    <blockquote>
                        <p>
                            <i>1、查看资料栏目不允许修改。</i>
                        </p>
                        <p>
                            <i>2、修改签名栏目，用户可以填写的签名最多字数不超过140个（含标点）。</i>
                        </p>
                        <p>
                            <i>3、修改头像栏目，用户可以上传任意格式的图片，大小在5M以内。</i>
                        </p>
                        <p>
                            <i>4、修改密码栏目，用户填写的密码两次必须一致，长度在6至20个字符内。</i>
                        </p>
                    </blockquote>
                </div>
                <Col span={24}>
                    <Spin spinning={loading}>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="查看资料" key="1">
                                <Card title="查看资料" bordered={false}>
                                    <Form {...this.formItemLayout}>
                                        <Form.Item label="用户名" {...this.formItemLayout}>
                                            <Input type='text' value={personalInfo.user} disabled={true}/>
                                        </Form.Item>
                                        <Form.Item label="性别" {...this.formItemLayout}>
                                            <Input type='text' value={personalInfo.sex} disabled={true}/>
                                        </Form.Item>
                                        <Form.Item label="邮箱" {...this.formItemLayout}>
                                            <Input type='text' value={personalInfo.email} disabled={true}/>
                                        </Form.Item>
                                        <Form.Item label="qq" {...this.formItemLayout}>
                                            <Input type='text' value={personalInfo.qq} disabled={true}/>
                                        </Form.Item>
                                        <Form.Item label="phone" {...this.formItemLayout}>
                                            <Input type='text' value={personalInfo.phone} disabled={true}/>
                                        </Form.Item>
                                        <Form.Item label="生日" {...this.formItemLayout}>
                                            <Input type='text' value={personalInfo.birthday} disabled={true}/>
                                        </Form.Item>
                                        <Form.Item label="故乡" {...this.formItemLayout}>
                                            <Input type='text' value={personalInfo.hometown} disabled={true}/>
                                        </Form.Item>
                                    </Form>
                                </Card>
                            </TabPane>
                            <TabPane tab="修改签名" key="2">
                                <Card title="修改签名" bordered={false}>
                                    <Form {...this.formItemLayout} onSubmit={this.handleAutographSubmit}>
                                        <Form.Item label="个性签名" {...this.formItemLayout}>
                                            {
                                                getFieldDecorator('autograph', {
                                                    initialValue: personalInfo.autograph,
                                                    rules: [
                                                        {required: true, message: '请输入个性签名'},
                                                        {min: 1, message: '长度在 1 到 140 个字符'},
                                                        {max: 140, message: '长度在 1 到 140 个字符'},
                                                    ]
                                                })(<Input.TextArea autosize={{minRows: 4, maxRows: 6}}/>)
                                            }
                                        </Form.Item>
                                        <Form.Item {...this.buttonItemLayout}>
                                            <Button type="primary" htmlType="submit">提交</Button>
                                        </Form.Item>
                                    </Form>
                                </Card>
                            </TabPane>
                            <TabPane tab="修改头像" key="3">
                                <Card title="修改头像" bordered={false}>
                                    <UploadLogo/>
                                </Card>
                            </TabPane>
                            <TabPane tab="修改密码" key="4">
                                <Card title="修改密码" bordered={false}>
                                    <Form {...this.formItemLayout} onSubmit={this.handlePwdSubmit}>
                                        <Form.Item label="请输入密码" {...this.formItemLayout}>
                                            {
                                                getFieldDecorator('password1', {
                                                    rules: [
                                                        {
                                                            validator: this.validatePwd1
                                                        }
                                                    ]
                                                })(
                                                    <Input.Password/>
                                                )}
                                        </Form.Item>
                                        <Form.Item label="请再次输入密码" {...this.formItemLayout}>
                                            {
                                                getFieldDecorator('password2', {
                                                    rules: [
                                                        {
                                                            validator: this.validatePwd2
                                                        }
                                                    ]
                                                })(
                                                    <Input.Password/>
                                                )}
                                        </Form.Item>
                                        <Form.Item {...this.buttonItemLayout}>
                                            <Button type="primary" htmlType="submit">提交</Button>
                                        </Form.Item>
                                    </Form>
                                </Card>
                            </TabPane>
                        </Tabs>
                    </Spin>
                </Col>
            </section>
        );
    }
}

// 对外暴露
const WrapInfo = Form.create()(Info);
export default WrapInfo