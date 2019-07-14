import React, { Component } from 'react';
import './index.less'
import {requestLogin} from '../../api'
import { Form, Icon, Input, Button, Checkbox,message } from 'antd';
import {Redirect} from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-07-07 - 10:09
 * 描述：登录的路由组件
 */

// 定义组件（ES6）
class Login extends Component {

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
  validatePwd = (rule, value, callback) => {
    if(!value) {
      callback('密码必须输入')
    } else if (value.length<6) {
      callback('密码长度不能小于6位')
    } else if (value.length>20) {
      callback('密码长度不能大于20位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须是英文、数字或下划线组成')
    } else {
      callback() // 验证通过
    }
    // callback('xxxx') // 验证失败, 并指定提示的文本
  };

  // 提交表单
  handleSubmit = (e) =>{
    // 阻止表单的默认提交
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      // 通过验证
      if (!err) {
        let loginParams = { user: values.username, password: values.password };
        const result = await requestLogin(loginParams);
        let { code, data } = result;
        if(code === 0)
        {
          memoryUtils.user = data;// 保存在内存中
          storageUtils.saveUser(data); // 保存到local中
          // 跳转到管理界面 (不需要再回退回到登陆),push是需要回退
          this.props.history.replace('/backstage')
        } else if(code === 5) {
          message.error('请输入用户名和密码');
        } else {
          message.error('用户名或密码错误');
        }
      }else{
        console.log('form check fail: ', values);
      }
    });
  };

  render() {

    // 如果用户已经登陆, 自动跳转到管理界面
    const user = memoryUtils.user;
    if(user && user.user) {
      return <Redirect to='/backstage'/>
    }

    // 得到强大的form对象
    const form = this.props.form;
    const {getFieldDecorator} = form;
    return (
      <div className="core-div">
        <Form onSubmit={this.handleSubmit} className="login-form login-container">
          <h2 className="title">统一身份认证</h2>
          <Form.Item>
            {
              /*
            用户名/密码的的合法性要求
              1). 必须输入
              2). 必须大于等于4位
              3). 必须小于等于12位
              4). 必须是英文、数字或下划线组成
             */
            }
            {
              getFieldDecorator('username',{
                // 配置对象: 属性名是特定的一些名称
                // 声明式验证: 直接使用别人定义好的验证规则进行验证
                rules: [
                  { required: true, whitespace: true, message: '用户名必须输入' },
                  { min: 4, message: '用户名至少4位' },
                  { max: 12, message: '用户名最多12位' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
                ],
                // initialValue: 'admin', // 初始值
              })(
                  <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="账号"
                  />
              )
            }
          </Form.Item>
          <Form.Item>
            {
              getFieldDecorator('password',{
                rules:[
                  {
                    validator: this.validatePwd
                  }
                ]
              })(
                  <Input.Password
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="密码"
                  />
              )
            }
          </Form.Item>
          <Form.Item>
            <Checkbox className="remember">记住密码</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

/*
1. 高阶函数
    1). 一类特别的函数
        a. 接受函数类型的参数
        b. 返回值是函数
    2). 常见
        a. 定时器: setTimeout()/setInterval()
        b. Promise: Promise(() => {}) then(value => {}, reason => {})
        c. 数组遍历相关的方法: forEach()/filter()/map()/reduce()/find()/findIndex()
        d. 函数对象的bind()
        e. Form.create()() / getFieldDecorator()()
    3). 高阶函数更新动态, 更加具有扩展性
2. 高阶组件
    1). 本质就是一个函数
    2). 接收一个组件(被包装组件), 返回一个新的组件(包装组件), 包装组件会向被包装组件传入特定属性
    3). 作用: 扩展组件的功能
    4). 高阶组件也是高阶函数: 接收一个组件函数, 返回是一个新的组件函数
 */
/*
包装Form组件生成一个新的组件: Form(Login)
新组件会向Form组件传递一个强大的对象属性: form
 */

// 对外暴露
/*包装Form组件生成一个新的组件: Form(Login)
*新组件会向Form组件传递一个强大的对象属性: form
*/
const WrapLogin = Form.create()(Login);
export default WrapLogin