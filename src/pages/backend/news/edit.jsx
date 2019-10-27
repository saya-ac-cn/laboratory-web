import React, {Component} from 'react';
import {Button, Form, Col, Input, Tag, Icon} from "antd";
import RichTextEditor from '../../../component/for-editor'
import {openNotificationWithIcon} from "../../../utils/window";
import {getNews, editNews, publishNews} from "../../../api/index"
import DocumentTitle from 'react-document-title'
import "./index.less"
/*
 * 文件名：edit.jsx
 * 作者：liunengkai
 * 创建日期：2019-07-27 - 21:44
 * 描述：编辑动态
 */

// 定义组件（ES6）
class EditPage extends Component {

    state = {
        tagColor:['magenta','red','volcano','orange','gold','lime','green','cyan','blue','geekblue','purple'],
        tags: [],
        inputVisible: false,
        inputValue: '',
        form: {},
        isUpdate: false,
        id: ''
    };

    constructor (props) {
        super(props);
        // 创建用来保存ref标识的标签对象的容器
        this.editor = React.createRef();
    }

    /**
     * 删除tag
     * @param removedTag
     */
    handleClose = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.setState({ tags });
    };

    /**
     * 显示文本框，让用户可输入
     */
    showInput = () => {
        let _this = this;
        let tags = _this.state.tags;
        // 至多允许用户输入5个tag
        if (tags.length < 5){
            this.setState({ inputVisible: true }, () => this.input.focus());
        }
    };

    handleInputChange = e => {
        this.setState({ inputValue: e.target.value });
    };

    /**
     * 添加tag
     */
    handleInputConfirm = () => {
        const { inputValue } = this.state;
        let { tags } = this.state;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    };


    forMap = tag => {
        let colors = this.state.tagColor;
        const tagElem = (
            <Tag
                closable
                color={colors[Math.floor(Math.random()*10)]}
                onClose={e => {
                    e.preventDefault();
                    this.handleClose(tag);
                }}
            >
                {tag}
            </Tag>
        );
        return (<span key={tag} style={{ display: 'inline-block' }}>{tagElem}</span>
        );
    };


    /**
     * 提交数据
     */
    submit = () => {
        let _this = this;
        let {tags, isUpdate, id} = _this.state
        // 调用子组件
        if (_this.editor.current.isNull() === true){
            openNotificationWithIcon("error", "错误提示", "请填写您要发布的内容");
            return
        }
        // 调用子组件
        const editor = _this.editor.current.getDetail()
        this.props.form.validateFields( (error, values) => {
            if (!error) {
                // 通过核验
                var _thisTag = null
                if (tags.length > 1){
                    _thisTag = tags.join(';')
                } else if(tags.length === 1){
                    _thisTag = tags[0]
                } else {
                    _thisTag = null
                }
                if (isUpdate){
                    // 走更新的流程
                    let para = {
                        id: id,
                        topic: values.topic,
                        label: _thisTag,//标签
                        content: editor
                    };
                    _this.updateNews(para)
                } else{
                    // 走发布的流程
                    let para = {
                        topic: values.topic,
                        label: _thisTag,//标签
                        content: editor
                    };
                    _this.createNews(para)
                }
            }else{
                console.log("no")
            }
        })
    };

    // 更新动态
    updateNews = async (param) => {
        const {msg, code} = await editNews(param);
        if (code === 0) {
            openNotificationWithIcon("success", "操作结果", "动态修改成功");
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    };

    // 创建动态
    createNews = async (param) => {
        const {msg, code} = await publishNews(param);
        if (code === 0) {
            openNotificationWithIcon("success", "操作结果", "动态发布成功");
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    };


    /**
     * 获取动态详情数据
     * @returns {Promise<void>}
     */
    initDatas = async (id) => {
        let para = {
            id: id
        };
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getNews(para);
        if (code === 0) {
            this.setState({
                tags: data.label === null ? [] : (data.label).split(';'),
                form: data,
                isUpdate:true,
                id: id
            });
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    };

    /**
     * 初始化页面配置信息
     */
    componentWillMount() {
        let _this = this;
        // 取出携带的state
        let news = _this.props.location.state;  // 如果是添加没值, 否则有值
        if (news){
            _this.initDatas(news.id)
        } else {
            let form = {content:" "};// 初始化
            _this.setState({
                isUpdate:!!news,
                form: form
            });
        }
        this.formItemLayout = {
            labelCol: {span: 2},
            wrapperCol: {span: 21},
        };
        this.buttonItemLayout = {
            wrapperCol: {span: 21, offset: 2},
        };
    };


    render() {
        const {getFieldDecorator} = this.props.form;
        const { tags, inputVisible, inputValue,form } = this.state;
        const tagChild = tags.map(this.forMap);
        return (
            <DocumentTitle title='编辑动态'>
                <section className='b-edit-news-page'>
                    <div className="mytips">
                        <p>平台发布动态约定：</p>
                        <blockquote>
                            <p>
                                <i>1、动态标题必须填写。</i>
                            </p>
                            <p>
                                <i>2、标签可以填写也可以不填写，最多不超过5个(≤5)标签。</i>
                            </p>
                            <p>
                                <i>3、动态内容必须填写，书写采用暂采用Html语法，后期将升级为MarkDown语法。书写完毕后，建议到前台页面查看实际效果，以便造成格式不兼容。</i>
                            </p>
                        </blockquote>
                    </div>
                    <Col span={24} className="b-edit-news-page-form">
                        <Form {...this.formItemLayout} className="bk-transparent">
                            <Form.Item label="标题" {...this.formItemLayout}>
                                {
                                    getFieldDecorator('topic', {
                                        initialValue: form.topic,
                                        rules: [
                                            {required: true, message: '请输入标题'},
                                            {max: 50, message: '最多不超过50个字符'},
                                        ]
                                    })(<Input type='text'/>)
                                }
                            </Form.Item>
                            <Form.Item label="标签" {...this.formItemLayout}>
                                <div style={{ marginBottom: 16 }}>
                                    {tagChild}
                                </div>
                                {inputVisible && (
                                    <Input
                                        ref={input => this.input = input}
                                        type="text"
                                        size="small"
                                        style={{ width: 78 }}
                                        value={inputValue}
                                        onChange={this.handleInputChange}
                                        onBlur={this.handleInputConfirm}
                                        onPressEnter={this.handleInputConfirm}
                                    />
                                )}
                                {!inputVisible && (
                                    <Tag onClick={this.showInput} >
                                        <Icon type="plus" /> New Tag
                                    </Tag>
                                )}
                            </Form.Item>
                            <Form.Item label="内容" {...this.formItemLayout}>
                                <RichTextEditor ref={this.editor} detail={form.content}/>
                            </Form.Item>
                            <Form.Item {...this.buttonItemLayout}>
                                <Button htmlType="button" type="primary" onClick={this.submit}>提交</Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </section>
            </DocumentTitle>
        );
    }
}

/*
1. 子组件调用父组件的方法: 将父组件的方法以函数属性的形式传递给子组件, 子组件就可以调用
2. 父组件调用子组件的方法: 在父组件中通过ref得到子组件标签对象(也就是组件对象), 调用其方法
*/

/*
使用ref
1. 创建ref容器: thi.pw = React.createRef()
2. 将ref容器交给需要获取的标签元素: <PictureWall ref={this.pw} />
3. 通过ref容器读取标签元素: this.pw.current
*/

// 对外暴露
const WrapEditPage = Form.create()(EditPage);
export default WrapEditPage;