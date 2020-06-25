import React, {Component} from 'react';
import {Button, Col, DatePicker, Icon, Table, Form, Input, Modal, Upload} from "antd";
import {getFileList, deleteFile, editFile, uploadFile, downloadFileForAdmin} from "../../../api";
import {openNotificationWithIcon} from "../../../utils/window";
import moment from 'moment';
import axios from "axios";
import DocumentTitle from 'react-document-title'
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-08-11 - 17:31
 * 描述：文件管理主页
 */
const {RangePicker} = DatePicker;
const { Dragger } = Upload;
// 定义组件（ES6）
class FilesMane extends Component {

    state = {
        // 返回的单元格数据
        datas: [],
        // 总数据行数
        dataTotal: 0,
        // 当前页
        nowPage: 1,
        // 页面宽度
        pageSize: 10,
        // 是否显示加载
        listLoading: false,
        //上传界面是否显示
        uploadVisible: false,
        filters: {
            beginTime: null,// 搜索表单的开始时间
            endTime: null,// 搜索表单的结束时间
            filename: null
        },
    };

    /**
     * 初始化上传组件信息
     */
    initUpload = () => {
        let _this = this;
        _this.uploadConfig = {
            name: 'file',
            multiple: true,
            action: uploadFile,
            data: file => ({
                // data里存放的是接口的请求参数
                // 这里文件传递唯一序列码（前端生成）
                uid: file.uid,
            }),
            onRemove: file => {
                // 删除文件
                _this.deleteFile({'uid':file.uid})
            },
            onChange(info) {
                const { status } = info.file;
                if (status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    openNotificationWithIcon("success", "上传成功", `${info.file.name} file uploaded successfully.`);
                    _this.getDatas();
                } else if (status === 'error') {
                    openNotificationWithIcon("error", "错误提示", `${info.file.name} file upload failed.`);
                }
            },
        };
    };

    /*
     * 初始化Table所有列的数组
     */
    initColumns = () => {
        this.columns = [
            {
                title: '文件名',
                dataIndex: 'filename', // 显示数据对应的属性名
            },
            {
                title: '上传者',
                dataIndex: 'source', // 显示数据对应的属性名
            },
            {
                title: '状态',
                render: (text, record) => {
                    if (record.status === '1') {
                        return '已显示'
                    } else if (record.status === '2') {
                        return '已屏蔽'
                    } else {
                        return '未知'
                    }
                }
            },
            {
                title: '日期',
                dataIndex: 'date', // 显示数据对应的属性名
            },
            {
                title: '下载',
                render: (text, record) => (
                    <div>
                        <Button type="primary" onClick={() => this.downloadFile(record)} shape="circle" icon="cloud-download"/>
                        &nbsp;
                        <Button type="primary" onClick={() => this.handleChangeFile(record)} shape="circle" icon="edit"/>
                        &nbsp;
                        <Button type="danger" onClick={() => this.handleDeleteFile(record)} shape="circle" icon="delete"/>
                    </div>
                ),
            },
        ]
    };

    /**
     * 获取文件列表数据
     * @returns {Promise<void>}
     */
    getDatas = async () => {
        let para = {
            nowPage: this.state.nowPage,
            pageSize: this.state.pageSize,
            beginTime: this.state.filters.beginTime,
            endTime: this.state.filters.endTime,
            filename: this.state.filters.filename,
        };
        // 在发请求前, 显示loading
        this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getFileList(para);
        // 在请求完成后, 隐藏loading
        this.setState({listLoading: false});
        if (code === 0) {
            this.setState({
                // 总数据量
                dataTotal: data.dateSum,
                // 表格数据
                datas: data.grid
            });
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
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
            nowPage: 1,
            filters: filters
        }, function () {
            _this.getDatas()
        });
    };

    /**
     * 回调函数,改变页宽大小
     * @param pageSize
     * @param current
     */
    changePageSize = (pageSize, current) => {
        // react在生命周期和event handler里的setState会被合并（异步）处理,需要在回调里回去获取更新后的 state.
        this.setState({
            nowPage: 1,
            pageSize: pageSize
        }, function () {
            this.getDatas();
        });
    };

    // 回调函数，页面发生跳转
    changePage = (current) => {
        this.setState({
            nowPage: current,
        }, function () {
            this.getDatas();
        });
    };

    // 日期选择发生变化
    onChangeDate = (date, dateString) => {
        let _this = this;
        let {filters} = _this.state;
        // 为空要单独判断
        if (dateString[0] !== '' && dateString[1] !== ''){
            filters.beginTime = dateString[0];
            filters.endTime = dateString[1];
        }else{
            filters.beginTime = null;
            filters.endTime = null;
        }
        _this.setState({
            nowPage: 1,
            filters
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
            nowPage: 1,
            filters
        })
    };

    /**
     * 取消上传
     */
    handleCancelUpload = () => {
        let _this = this;
        let uploadVisible = false;
        _this.setState({
            uploadVisible
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
     * 删除文件
     */
    deleteFile = async (para) => {
        // 在发请求前, 显示loading
        this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code} = await deleteFile(para);
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
     * 弹框确认删除
     */
    handleDeleteFile = (item) => {
        let _this = this;
        Modal.confirm({
            title: '删除确认',
            content: `确认文件名为:'${item.filename}'的文件吗?`,
            onOk: () => {
                let para = { id: item.id };
                _this.deleteFile(para)
            }
        })
    };

    /**
     * 下载文件
     * @param row
     */
    downloadFile = (row) => {
        let _this = this;
        // 在发请求前, 显示loading
        _this.setState({listLoading: true});
        axios({
            method: "GET",
            url: downloadFileForAdmin+row.id,   //接口地址
            responseType: 'blob',
            //上面这个参数不加会乱码，据说{responseType: 'arraybuffer'}也可以
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(function (res) {
                console.log(res)
                _this.setState({listLoading: false});
                let fileName = row.filename;//文件名称
                let blob = new Blob([res.data]);
                if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, fileName);
                } else {
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                }
            })
            .catch(function (res) {
                _this.setState({listLoading: false});
                openNotificationWithIcon("error", "错误提示", "下载文件失败"+res);
            });
    };

    /**
     * 改变文件状态
     * @param item
     */
    handleChangeFile = (item) => {
        let _this = this;
        var message = '';
        var sendStatus = null;
        if (item.status === '1')
        {
            // 屏蔽
            sendStatus = 2;
            message = `您确定要屏蔽文件名为：' ${item.filename} '的文件吗？`
        } else {
            // 显示
            sendStatus = 1;
            message = `您确定要显示文件名为：' ${item.filename} '的文件吗？`
        }
        Modal.confirm({
            title: '修改确认',
            content: message,
            onOk: async () => {
                let para = { id: item.id, status: sendStatus };
                // 在发请求前, 显示loading
                _this.setState({listLoading: true});
                // 发异步ajax请求, 获取数据
                const {msg, code} = await editFile(para);
                // 在请求完成后, 隐藏loading
                _this.setState({listLoading: false});
                if (code === 0) {
                    openNotificationWithIcon("success", "操作结果", "修改成功");
                    _this.getDatas();
                } else {
                    openNotificationWithIcon("error", "错误提示", msg);
                }
            }
        })

    };

    /*
     *为第一次render()准备数据
     * 因为要异步加载数据，所以方法改为async执行
     */
    componentWillMount() {
        // 初始化上传组件配置
        this.initUpload();
        // 初始化表格属性设置
        this.initColumns();
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
        const {datas, dataTotal, nowPage, pageSize, listLoading,filters, uploadVisible} = this.state;
        let {beginTime,endTime} = filters;
        let rangeDate;
        if (beginTime !== null && endTime !== null){
            rangeDate = [moment(beginTime),moment(endTime)]
        } else {
            rangeDate = [null,null]
        }
        return (
            <DocumentTitle title='文件管理'>
                <section>
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
                                    <Icon type="search" />查询
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="button" onClick={this.reloadPage}>
                                    <Icon type="reload" />重置
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="button" onClick={this.handleOpenUpload}>
                                    <Icon type="cloud-upload" />上传
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col span={24} className="dataTable">
                        <Table size="middle" rowKey="id" loading={listLoading} columns={this.columns} dataSource={datas}
                               pagination={{
                                   current:nowPage,
                                   showTotal: () => `当前第${nowPage}页 共${dataTotal}条`,
                                   pageSize: pageSize, showQuickJumper: true, total: dataTotal, showSizeChanger: true,
                                   onShowSizeChange: (current, pageSize) => this.changePageSize(pageSize, current),
                                   onChange: this.changePage,
                               }}/>
                    </Col>
                    <Modal
                        title="上传文件"
                        visible={uploadVisible === true}
                        onOk={this.handleCancelUpload}
                        onCancel={this.handleCancelUpload}>
                        <Dragger {...this.uploadConfig}>
                            <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                            </p>
                            <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
                            <p className="ant-upload-hint">
                                支持单个或批量上传，单个文件大小不能超过10M，禁止上传exe/bat等可执行文件。
                            </p>
                        </Dragger>
                    </Modal>
                </section>
            </DocumentTitle>
        );
    }
}

// 对外暴露
export default FilesMane;