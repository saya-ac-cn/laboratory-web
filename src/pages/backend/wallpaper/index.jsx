import React, {Component} from 'react';
import {Button, Row, Col, Icon, Input, Form, DatePicker, Modal, Spin, Upload} from "antd";
import moment from 'moment';
import './index.less'
import {getPictureList, deletePicture, uploadWallpaper, setUserInfo} from "../../../api";
import {openNotificationWithIcon} from "../../../utils/window";
import DocumentTitle from 'react-document-title'
import axios from 'axios'
import memoryUtils from "../../../utils/memoryUtils";
import storageUtils from "../../../utils/storageUtils";
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-08-17 - 20:40
 * 描述：壁纸管理
 */
const {RangePicker} = DatePicker;

// 定义组件（ES6）
class Wallpaper extends Component {

    state = {
        filters: {
            beginTime: null,// 搜索表单的开始时间
            endTime: null,// 搜索表单的结束时间
            filename: null
        },
        // 返回的单元格数据
        datas: [],
        // 下一页
        nextpage: 1,
        // 是否显示加载
        listLoading: false,
        // 页面宽度
        pageSize: 10,
        // 是否显示上传层
        uploadVisible: false,
        previewVisible: false,
        previewImage: '',
        fileList: [],
    };


    /**
     * 获取壁纸列表数据
     * @returns {Promise<void>}
     */
    getDatas = async () => {
        let para = {
            type: 1,
            nowPage: 'null' === this.state.nextpage ? 1 : this.state.nextpage,
            pageSize: this.state.pageSize,
            beginTime: this.state.filters.beginTime,
            endTime: this.state.filters.endTime,
            filename: this.state.filters.filename,
        };
        // 在发请求前, 显示loading
        this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getPictureList(para);
        // 在请求完成后, 隐藏loading
        this.setState({listLoading: false});
        if (code === 0) {
            // 表格数据
            this.rendering(data);
        } else {
            this.setState({nextpage: 'null'});
            openNotificationWithIcon("error", "错误提示", msg);
        }
    };

    /**
     * 表格数据渲染
     * @param data
     */
    rendering = (data) => {
        let {datas, nextpage} = this.state;
        // 渲染数据
        if (!(this.isEmptyObject(data.grid))) {
            //第一页采用直接覆盖的显示方式
            if (data.pageNow === 1) {
                datas = data.grid;//绑定到Vue
            } else {
                datas = (datas).concat(data.grid);//追加，合并
            }
        } else {
            datas = 'null';
        }
        //显示是否加载下一页(当前页是最后一页)
        console.log("是否当前页：",data.pageNow === data.totalPage)
        if (data.pageNow === data.totalPage) {
            nextpage = 'null';
        } else {
            nextpage = data.pageNow + 1;
        }
        console.log("设置下一页：",nextpage)
        this.setState({
            datas: datas,
            nextpage: nextpage
        })
    };

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
    };

    // 日期选择发生变化
    onChangeDate = (date, dateString) => {
        let _this = this;
        let {filters} = _this.state;
        // 为空要单独判断
        if (dateString[0] !== '' && dateString[1] !== '') {
            filters.beginTime = dateString[0];
            filters.endTime = dateString[1];
        } else {
            filters.beginTime = null;
            filters.endTime = null;
        }
        _this.setState({
            nextpage: 1,
            filters
        }, function () {
            _this.getDatas()
        });
    };

    /**
     * 重置查询条件
     */
    reloadPage = () => {
        // 重置查询条件
        let _this = this;
        let filters = _this.state.filters;
        filters.beginTime = null;
        filters.endTime = null;
        filters.filename = null;
        _this.setState({
            nextpage: 1,
            filters: filters
        }, function () {
            _this.getDatas()
        });
    };

    /**
     * 接口名文本框内容改变事件（用于双向绑定数据）
     * @param event
     */
    fileInputInputChange = (event) => {
        let _this = this;
        const value = event.target.value;
        let filters = _this.state.filters;
        filters.filename = value;
        _this.setState({
            nextpage: 1,
            filters
        })
    };

    /**
     * 弹框确认删除
     */
    handleDeleteFile = (e) => {
        let _this = this;
        // 得到自定义属性
        let id =  e.currentTarget.getAttribute('data-id')
        Modal.confirm({
            title: '删除确认',
            content: `确认编号为:'${id}'的壁纸吗?`,
            onOk: () => {
                let para = { id: id};
                _this.deletePicture(para)
            }
        })
    };

    /**
     * 设置壁纸
     * @param e
     */
    handleSetBackbround = async (e) => {
        let _this = this;
        // 得到自定义属性
        let src =  e.currentTarget.getAttribute('data-src')
        let id =  e.currentTarget.getAttribute('data-id')
        let flag = false;
        // 利用axios检测该壁纸能否打开
        await axios.get(src)
            .then(function(response){
                flag = true
            })
            .catch(function(err){
                flag = false
            });
        if (true === flag) {
            let para = {
                background: parseInt(id)
            };
            // 在发请求前, 显示loading
            _this.setState({listLoading: true});
            const result = await setUserInfo(para);
            // 在请求完成后, 隐藏loading
            _this.setState({listLoading: false});
            let {msg, code} = result;
            if (code === 0) {
                const data = memoryUtils.user;
                data.user.background = src;
                data.user.backgroundId = parseInt(id);
                memoryUtils.user = data;// 保存在内存中
                storageUtils.saveUser(data); // 保存到local中
                openNotificationWithIcon("success", "操作结果", "壁纸设置成功");
            } else {
                openNotificationWithIcon("error", "错误提示", msg);
            }
        }else{
            openNotificationWithIcon("error", "错误提示", '当前壁纸图片无效，该壁纸不能设置');
        }
    }

    /**
     * 执行删除操作
     * @param para
     * @returns {Promise<void>}
     */
    deletePicture = async (para) => {
        // 在发请求前, 显示loading
        this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code} = await deletePicture(para);
        // 在请求完成后, 隐藏loading
        this.setState({listLoading: false});
        if (code === 0) {
            openNotificationWithIcon("success", "操作结果", "删除成功");
            this.getDatas();
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    };

    /**
     * 取消上传
     */
    handleCancelUpload = () => {
        let _this = this;
        let uploadVisible = false;
        _this.setState({
            uploadVisible:uploadVisible,
            fileList: []
        })
    };

    /**
     * 打开上传框
     */
    handleOpenUpload = () => {
        let _this = this;
        let uploadVisible = true;
        _this.setState({
            uploadVisible
        })
    };

    /**
     * 处理图片为Base64
     * @param file
     * @returns {Promise<any>}
     */
    getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    /**
     * 关闭图片预览
     */
    handleCancel = () => this.setState({ previewVisible: false });

    /**
     * 预览图片
     * @param file
     * @returns {Promise<void>}
     */
    handlePreview = async (file) => {
        // if (!file.url && !file.preview) {
        //     file.preview = this.getBase64(file.originFileObj);
        // }
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    /**
     * 上传前添加到list，
     * @param fileList
     */
    handleChange = (info) => {
        let fileList = info.fileList;
        const { status } = info.file;
        // 注意，发生一次上传后，会有三个顺序的status变化，done，uploading，dong，而，只需要处理最后一个状态即可
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            openNotificationWithIcon("success", "上传成功", `${info.file.name} file uploaded successfully.`);
            this.getDatas();
        } else if (status === 'error') {
            openNotificationWithIcon("error", "错误提示", `${info.file.name} file upload failed.`);
        }
        this.setState({ fileList });
    };

    // handleChange = ({ fileList }) => {
    //     this.setState({ fileList });
    // };

    /**
     * 删除图片
     * @param file
     */
    handleDelete = (file) => {
        console.log(file)
        this.setState(state => {
            const index = state.fileList.indexOf(file);
            console.log(index)
            const newFileList = state.fileList.slice();
            newFileList.splice(index, 1);
            return {
                fileList: newFileList,
            };
        },function () {
            console.log(this.state.fileList)
        });
    };

    /**
     * 大图预览
     */
    previewPhoto = () => {
        console.log("进入大图预览")
    };

    /*
    执行异步任务: 发异步ajax请求
     */
    componentDidMount() {
        // 加载页面数据
        this.getDatas();
    };


    render() {
        // 读取状态数据
        const {filters, datas, nextpage, listLoading, uploadVisible, previewVisible, previewImage, fileList} = this.state;
        let {beginTime, endTime} = filters;
        let rangeDate;
        if (beginTime !== null && endTime !== null) {
            rangeDate = [moment(beginTime), moment(endTime)]
        } else {
            rangeDate = [null, null]
        }
        const user = memoryUtils.user;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <DocumentTitle title='壁纸管理'>
                <section>
                    <Modal
                        title="壁纸文件"
                        visible={uploadVisible === true}
                        onOk={this.handleCancelUpload}
                        onCancel={this.handleCancelUpload}>
                        <Upload
                            action={uploadWallpaper}
                            listType="picture-card"
                            accept="image/jpeg,image/jpg,image/png,image/bmp"
                            fileList={fileList}
                            onPreview={this.handlePreview}
                            onChange={this.handleChange}
                            onRemove={this.handleDelete}>
                            {fileList.length >= 8 ? null : uploadButton}
                        </Upload>
                    </Modal>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                    <Row>
                        <Col span={24} className="toolbar">
                            <Form layout="inline">
                                <Form.Item>
                                    <Input type='text' value={filters.filename} onChange={this.fileInputInputChange}
                                           placeholder='请输入文件名'/>
                                </Form.Item>
                                <Form.Item>
                                    <RangePicker value={rangeDate} onChange={this.onChangeDate}/>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="button" onClick={this.getDatas}>
                                        <Icon type="search"/>查询
                                    </Button>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="button" onClick={this.reloadPage}>
                                        <Icon type="reload"/>重置
                                    </Button>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="button" onClick={this.handleOpenUpload}>
                                        <Icon type="cloud-upload" />上传
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    {
                        listLoading === true ? <Spin/> :
                            <ul className="wallpaper-ul">
                                {datas !=='null' ? datas.map((item) => (
                                        <li span={6} className="album-div-imgdiv" key={item.id}>
                                            <div className="tools">
                                                <Button type="primary" shape="circle" icon="delete" data-id={item.id} onClick={this.handleDeleteFile} size="small" title="删除"/>
                                                {
                                                    user.user.backgroundId === item.id ?
                                                        null
                                                    :
                                                        <Button type="primary" style={{marginLeft: '0.5em'}} shape="circle" icon="heart" data-id={item.id} data-src={item.weburl} onClick={this.handleSetBackbround} size="small" title="设为壁纸"/>
                                                }
                                            </div>
                                            <a href="#toolbar" onClick={this.previewPhoto} rel="noopener noreferrer" className="a-img">
                                                <img src={item.weburl} alt={item.filename}
                                                     className="img-responsive"/>
                                            </a>
                                        </li>
                                    )):
                                    <li span={6} className="album-div-imgdiv">
                                        <Button type="primary" shape="circle" icon="minus" size="small" title="好像并没有照片诶"/>
                                    </li>
                                }
                                {nextpage !=='null' ?
                                    <li span={6} className="album-div-imgdiv">
                                        <Button type="primary" onClick={this.getDatas} shape="circle" icon="more" size="small" title="加载更多"/>
                                    </li>
                                    :
                                    <li span={6} className="album-div-imgdiv">
                                        <Button type="primary" shape="circle" icon="check" size="small" title="已经加载完壁纸了"/>
                                    </li>
                                }
                            </ul>
                    }
                </section>
            </DocumentTitle>
        );
    }
}

// 对外暴露
export default Wallpaper;