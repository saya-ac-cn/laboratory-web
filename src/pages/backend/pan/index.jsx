import React, {Component} from 'react';
import DocumentTitle from 'react-document-title'
import {Button, Col, Icon, Form, Radio, Breadcrumb, Table, Modal, Input, Badge, Popover} from "antd";
import './index.less'
import {getPanFileList, createFolder} from "../../../api";
import {openNotificationWithIcon} from "../../../utils/window";
import {formatSize} from "../../../utils/format";
import menuConfig from "../../../config/backendMenuConfig";

/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2020-05-10 - 20:09
 * 描述：
 */

// 定义组件（ES6）
class Pan extends Component {

    state = {
        // 返回的单元格数据
        datas: [],
        // 顶部文件路径
        navigation: [],
        // 复选框选中的行
        selectedRowKeys: [],
        // 是否显示加载
        listLoading: false,
        // 文件夹的弹框显示，0 都不显示，1 处于创建中；2 处于修改中
        folderModal: 0,
        filters: {
            parentId: 0,
        },
    };

    /*
    * 初始化Table所有列的数组
    */
    initColumns = () => {
        this.columns = [
            {
                title: '文件名',
                dataIndex: 'fileName', // 显示数据对应的属性名
            },
            {
                title: '大小',
                render: (text, record) => {
                    let size = formatSize(record.size, 2);
                    if (record.type === 'folder' || size === undefined) {
                        return '-'
                    }
                    return size
                }
            },
            {
                title: '修改时间',
                render: (text, record) => {
                    if (record.updateTime === null || record.updateTime) {
                        return record.createTime
                    }else {
                        return record.updateTime
                    }
                }
            },
            {
                title: '操作',
                render: (text,record) => {
                    let content = (
                        <div>
                            <p>移动</p>
                            <p>复制</p>
                            <p>删除</p>
                            {(record.type !== 'folder')?<p>重命名</p>:null}
                            <p>下载</p>
                        </div>
                    );
                    return <Popover content={content}>
                                <Icon type="ellipsis" />
                           </Popover>
                }
            },
        ]
    };

    /**
     * 获取列表数据
     * @returns {Promise<void>}
     */
    getDatas = async () => {
        let para = {
            parentId: this.state.filters.parentId,
        };
        // 在发请求前, 显示loading
        this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getPanFileList(para);
        // 在请求完成后, 隐藏loading
        this.setState({listLoading: false});
        if (code === 0) {
            this.setState({
                // 文件路径
                navigation: data.folderPaths,
                // 表格数据
                datas: data.files
            });
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    };

    // 文件路径切换发生跳转
    changeFilePath = (current) => {
        let _this = this;
        let filters = _this.state.filters;
        filters.parentId = current;
        _this.setState({
            filters
        }, function () {
            _this.getDatas()
        });
    };

    /*
    * 显示创建&修改文件夹或关闭的弹窗
    */
    handleFolderModal = (status) => {
        this.setState({
            folderModal: status
        })
    };

    /**
     * 创建文件夹
     */
    handleCreateFolder = () => {
        let _this = this;
        let filters = _this.state.filters;
        _this.props.form.validateFields(async (err, values) => {
            if (!err) {
                // 在发请求前, 显示loading
                _this.setState({listLoading: true});
                let para = { fileName: values.folderName,parentId: filters.parentId,type: "folder"};
                const {msg, code} = await createFolder(para);
                // 在请求完成后, 隐藏loading
                _this.setState({listLoading: false});
                if (code === 0) {
                    openNotificationWithIcon("success", "操作结果", "创建成功");
                    _this.changeFilePath(filters.parentId);
                    _this.handleFolderModal(0)
                } else {
                    openNotificationWithIcon("error", "错误提示", msg);
                }
            }else {
                openNotificationWithIcon("error", "错误提示", "您创建的文件夹名有误，请根据提示正确填写。");
            }
        });
    }

    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    // 判断当前下载按钮是否可用
    canDownload = () =>{
        let _this = this;
        let {datas,selectedRowKeys} = _this.state
        let hasFolder = false
        condition:for (var i = 0;i < selectedRowKeys.length; i++){
            for (var j = 0;j < datas.length; j++){
                if (selectedRowKeys[i] === datas[j].id){
                    // 匹配到一行数据
                    if (datas[j].type === 'folder') {
                        hasFolder = true
                        break condition;
                    }
                }
            }
        }
        return !hasFolder && selectedRowKeys.length > 0
    }

    /*
     * 为第一次render()准备数据
     * 因为要异步加载数据，所以方法改为async执行
     */
    componentWillMount() {
        // 初始化表格属性设置
        this.initColumns();
        this.formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 14},
        };
    };

    /*
    执行异步任务: 发异步ajax请求
     */
    componentDidMount() {
        // 加载页面数据
        this.getDatas();
    };

    // result.put("files", files);
    // result.put("folderPaths", folderPaths);
    render() {
        // 得到强大的form对象
        const form = this.props.form;
        const {getFieldDecorator} = form;
        // 读取状态数据
        const {datas, listLoading, filters, navigation,folderModal,selectedRowKeys} = this.state;
        return (
            <DocumentTitle title='私密网盘'>
                <section>
                    <Col span={24} className="toolbar">
                        <Form layout="inline">
                            <Form.Item>
                                <Button type="primary" htmlType="button">
                                    <Icon type="cloud-upload"/>上传
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="button" onClick={()=>this.handleFolderModal(1)}>
                                    <Icon type="folder-add"/>新增文件夹
                                </Button>
                            </Form.Item>
                            <Form.Item>

                                <Radio.Group>
                                    {(selectedRowKeys.length === 1) ?
                                        (<Radio.Button value="a"><Icon type="edit"/>重命名</Radio.Button>)
                                        : null
                                    }
                                    {(this.canDownload()) ?
                                        (<Radio.Button value="b"><Icon type="cloud-download"/>下载</Radio.Button>)
                                        : null
                                    }
                                    {(selectedRowKeys.length > 0) ?
                                        (<Radio.Button value="c"><Icon type="delete"/>删除</Radio.Button>)
                                        : null
                                    }
                                    {(selectedRowKeys.length > 0) ?
                                        (<Radio.Button value="d"><Icon type="drag"/>移动到</Radio.Button>)
                                        : null
                                    }
                                    {(selectedRowKeys.length > 0) ?
                                        (<Radio.Button value="e"><Icon type="copy"/>复制到</Radio.Button>)
                                        : null
                                    }
                                </Radio.Group>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col span={24} className="folder-path">

                    </Col>
                    <Col span={24} className="dataTable">
                        <div className="table-operations">
                            <Breadcrumb separator="/" className="folder-breadcrumb">
                                {navigation.length > 1 ?
                                    <Breadcrumb.Item>返回上一级</Breadcrumb.Item> : null
                                }
                                {
                                    navigation.map((item, index) => {
                                        return <Breadcrumb.Item onClick={() => this.changeFilePath(item.id)} key={index}>{item.fileName}</Breadcrumb.Item>
                                    })
                                }
                            </Breadcrumb>
                        </div>
                        <Table size="middle" rowKey="id" rowSelection={{selectedRowKeys: selectedRowKeys,onChange: this.onSelectChange}} loading={listLoading} columns={this.columns}
                               dataSource={datas}/>
                    </Col>
                    <Modal
                        title="新增文件夹"
                        visible={folderModal === 1}
                        onOk={this.handleCreateFolder}
                        onCancel={()=>this.handleFolderModal(0)}>
                        <Form>
                            <Form.Item>
                                {
                                    getFieldDecorator('folderName', {
                                        rules: [
                                            {required: true, whitespace: true, message: '文件夹必须输入'},
                                            {max: 100, message: '文件夹最多100个字符位'},
                                            {pattern: /^.{1,100}$/, message: '用户名必须是英文、数字或下划线组成'},
                                        ],
                                        // initialValue: 'admin', // 初始值
                                    })(
                                        <Input
                                            prefix={<Icon type="folder" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                            placeholder="文件夹名"
                                        />
                                    )
                                }
                            </Form.Item>
                    </Form>
                    </Modal>
                </section>
            </DocumentTitle>
        );
    }
}

// 对外暴露
const WrapPan = Form.create()(Pan);
export default WrapPan