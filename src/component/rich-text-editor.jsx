import React, {Component} from 'react';
import {uploadNewsPicture} from '../api/index'
import PropTypes from 'prop-types'
import {EditorState, convertToRaw, ContentState} from 'draft-js'
import {Editor} from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import axios from "axios";
import {openNotificationWithIcon} from "../utils/window";
/*
 * 文件名：rich-text-editor.jsx
 * 作者：liunengkai
 * 创建日期：2019-07-28 - 17:22
 * 描述：富文本编辑器
 */

// 定义组件（ES6）
class RichTextEditor extends Component {

    static propTypes = {
        detail: PropTypes.string
    };

    state = {
        editorState: EditorState.createEmpty(), // 创建一个没有内容的编辑对象
    };


    constructor(props) {
        super(props);
        const html = this.props.detail;
        if (!!html) { // 如果有值, 根据html格式字符串创建一个对应的编辑对象
            const contentBlock = htmlToDraft(html);
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.state ={
                editorState:editorState,
                enitNum:1,// 已直接初始化
            }
            console.log("直接初始化",html)
        } else {
            this.state = {
                editorState: EditorState.createEmpty(), // 创建一个没有内容的编辑对象
                enitNum:0,// 未初始化
            }
        }

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
        if (enitNum === 0){
            if (!!html) { // 如果有值, 根据html格式字符串创建一个对应的编辑对象
                console.log("自加",html)
                const contentBlock = htmlToDraft(html);
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.setState({
                    editorState:editorState,
                    enitNum: enitNum+1
                })
            } else {
                console.log("不自加")
                this.setState({
                    editorState: EditorState.createEmpty(),
                })
            }
        }
    }

    /*
    * 输入过程中实时的回调(双向元素绑定)
    */
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        })
    }

    /**
     * 判断是否为空
     * @returns {boolean}
     */
    isNull = () => {
        let editorState = this.state.editorState.getCurrentContent();
        const contentBlock = htmlToDraft('<p></p>');
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const _editorState = EditorState.createWithContent(contentState);
        if (draftToHtml(convertToRaw(editorState)) === draftToHtml(convertToRaw(_editorState.getCurrentContent()))){
            return true;
        }else{
            return false;
        }
    }

    getDetail = () => {
        // 返回输入数据对应的html格式的文本
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    uploadImageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {
                let img = new Image();
                console.log(file)
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    img.src = this.result
                };
                console.log(file)
                img.onload = function () {
                    let para = {
                        filename: file.name,
                        fileurl:img.src
                    };
                    axios.post(uploadNewsPicture, para).then(response => {
                        const data = response.data // 得到响应数据
                        if (data.code === 0){
                            resolve({data: {link: data.data}})
                        }else {
                            openNotificationWithIcon("error", "错误提示", data.msg);
                            resolve({data: {link: ''}})
                        }
                        // /files/picture/illustrated/Pandora/20190728/2019072823539.png
                    }).catch(error => {
                        openNotificationWithIcon("error", "请求出错了", error.message);
                        reject(error)
                    })
                }
            }
        )
    }

    render() {
        const {editorState} = this.state
        return (
            <Editor
                editorState={editorState}
                editorStyle={{border: '1px solid #ccc', minHeight: 200, paddingLeft: 10}}
                onEditorStateChange={this.onEditorStateChange}
                toolbar={{
                    image: {uploadCallback: this.uploadImageCallBack, alt: {present: true, mandatory: true}},
                }}
            />
        )
    }
}

// 对外暴露
export default RichTextEditor;