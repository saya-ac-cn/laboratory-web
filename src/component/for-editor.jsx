import React, {Component} from 'react';
import Editor from 'for-editor'
import axios from "axios";
import {uploadNewsPicture} from "../api";
import {openNotificationWithIcon} from "../utils/window";
import {isEmptyObject} from "../utils/var"
import PropTypes from "prop-types";
/*
 * 文件名：for-editor.jsx
 * 作者：liunengkai
 * 创建日期：2019-10-27 - 17:37
 * 描述：for-editor编辑器（markdown）
 */

// 定义组件（ES6）
class ForEditor extends Component {

    static propTypes = {
        detail: PropTypes.string
    };

    constructor(props) {
        super(props)
        const html = this.props.detail;
        if (!!html) { // 如果有值, 根据html格式字符串创建一个对应的编辑对象
            // 这里html.trim()需要过滤空格，如果父页面请求的操作是添加，会传入一个" "空串，而这个if的初始化主要还是添加的初始化
            this.state = {
                value: html.trim(),
                enitNum: 1,// 已直接初始化
            }
            //console.log("在构造函数中完成初始化，父组件有传值")
        } else {
            this.state = {
                value: "",
                enitNum: 0,// 未初始化
            }
            //console.log("在构造函数中未完成初始化，等待父组件传值")
        }
        this.editor = React.createRef()
    }

    /**
     * 在组件接收新props时调用。初始渲染不调用此方法
     * @param data
     * 子父组件传值问题：https://www.jianshu.com/p/713206e571cf
     */
    componentWillReceiveProps(data) {
        const enitNum = this.state.enitNum;
        const html = data.detail;
        // 只能执行一次
        if (enitNum === 0) {
            if (!!html) { // 如果有值, 根据html格式字符串创建一个对应的编辑对象
                // 这里的初始化主要用于父组件修改操作的初始化
                this.setState({
                    value: html,
                    enitNum: enitNum + 1
                })
                //console.log("在子组件更新时完成初始化，接收父组件传值")
            } else {
                this.setState({
                    value: "",
                })
                //console.log("在子组件更新时未初始化，等待接收父组件传值")
            }
        }
    }

    //内容改变时回调
    handleChange = (value) => {
        this.setState({
            value
        })
    }

    //添加图片时回调
    handleAddImg = async (file) => {
        const {data} = await this.addImg(file);
        if (!isEmptyObject(data)) {
            // 第一个参数，图片的显示的描述信息，第二个参数，图片的url
            this.editor.current.$img2Url(file.name, data.link)
        } else {
            this.editor.current.$img2Url(file.name, 'file_url')
        }
    }

    //向后台添加图片
    addImg = (file) => {
        return new Promise(
            (resolve, reject) => {
                let img = new Image();
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    img.src = this.result
                };
                img.onload = function () {
                    let para = {
                        filename: file.name,
                        fileurl: img.src
                    };
                    axios.post(uploadNewsPicture, para).then(response => {
                        const data = response.data // 得到响应数据
                        if (data.code === 0) {
                            resolve({data: {link: data.data}})
                        } else {
                            openNotificationWithIcon("error", "错误提示", data.msg);
                            resolve({data: {link: ''}})
                        }
                        // /files/picture/illustrated/Pandora/20190728/2019072823539.png
                    }).catch(error => {
                        openNotificationWithIcon("error", "请求出错了", error.message);
                        reject(error)
                    })
                }
            })
    }

    /**
     * 判断是否为空
     * @returns {boolean}
     */
    isNull = () => {
        if (null === this.state.value || "" === (this.state.value).trim()) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 获取markdown
     * @returns {*}
     */
    getDetail = () => {
        return this.state.value;
    }


    render() {
        const {value} = this.state
        return (
            <Editor
                ref={this.editor}
                value={value}
                lineNum={false}
                style={{maxWidth: '80vw',border:'none',boxShadow:'none'}}
                addImg={(file) => this.handleAddImg(file)}
                onChange={value => this.handleChange(value)}
            />
        );
    }
}

// 对外暴露
export default ForEditor;