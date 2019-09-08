import React, {Component} from 'react';
import {Button, Row, Col, Icon, Input, Form, DatePicker, Modal, Spin} from "antd";
import moment from 'moment';
import './index.less'
import {getPictureList, deletePicture} from "../../../api";
import {openNotificationWithIcon} from "../../../utils/window";
import DocumentTitle from 'react-document-title'

/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-08-17 - 20:40
 * 描述：插图管理
 */
const {RangePicker} = DatePicker;

// 定义组件（ES6）
class Lllustration extends Component {

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
    };

    /**
     * 获取插图列表数据
     * @returns {Promise<void>}
     */
    getDatas = async () => {
        let para = {
            type: 2,
            nowPage: this.state.nextpage,
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
        if (data.pageNow === data.totalPage) {
            nextpage = 'null';
        } else {
            nextpage = data.pageNow + 1;
        }
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
        let {filters, nextpage} = _this.state;
        nextpage = 1;
        filters.beginTime = null;
        filters.endTime = null;
        filters.filename = null;
        _this.setState({
            nextpage: nextpage,
            filters: filters
        }, function () {
            _this.getDatas()
        });
    };

    /**
     * 文件名名文本框内容改变事件（用于双向绑定数据）
     * @param event
     */
    fileInputInputChange = (event) => {
        let _this = this;
        const value = event.target.value;
        let filters = _this.state.filters;
        filters.filename = value;
        _this.setState(filters)
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

    /*
    执行异步任务: 发异步ajax请求
     */
    componentDidMount() {
        // 加载页面数据
        this.getDatas();
    };


    render() {
        // 读取状态数据
        const {filters, datas, nextpage, listLoading} = this.state;
        let {beginTime, endTime} = filters;
        let rangeDate;
        if (beginTime !== null && endTime !== null) {
            rangeDate = [moment(beginTime), moment(endTime)]
        } else {
            rangeDate = [null, null]
        }
        return (
            <DocumentTitle title='插图管理'>
                <section>
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
                            </Form>
                        </Col>
                    </Row>
                    {
                        listLoading === true ? <Spin/> :
                            <Row>
                                {datas !=='null' ? datas.map((item) => (
                                        <Col span={6} className="album-div-imgdiv" key={item.id}>
                                            <div className="tools">
                                                <Button type="primary" shape="circle" icon="delete" data-id={item.id} onClick={this.handleDeleteFile} size="small" title="删除"/>
                                            </div>
                                            <a href="#toolbar" rel="noopener noreferrer" className="a-img">
                                                <img src={item.weburl} alt={item.filename}
                                                     className="img-responsive"/>
                                            </a>
                                        </Col>
                                    )):
                                    <Col span={6} className="album-div-imgdiv">
                                        <Button type="primary" shape="circle" icon="minus" size="small" title="好像并没有照片诶"/>
                                    </Col>
                                }
                                {nextpage !=='null' ?
                                    <Col span={6} className="album-div-imgdiv">
                                        <Button type="primary" onClick={this.getDatas} shape="circle" icon="more" size="small" title="加载更多"/>
                                    </Col>
                                    :
                                    <Col span={6} className="album-div-imgdiv">
                                        <Button type="primary" shape="circle" icon="check" size="small" title="已经加载完插图了"/>
                                    </Col>
                                }
                            </Row>
                    }
                </section>
            </DocumentTitle>
        );
    }
}

// 对外暴露
export default Lllustration;