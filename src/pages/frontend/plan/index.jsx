import React, {Component} from 'react';
import DocumentTitle from 'react-document-title'
import './index.less'
import {Spin, Modal, Icon} from "antd";
import {queryPlan} from "../../../api";
import {openNotificationWithIcon} from "../../../utils/window";
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-09-12 - 21:40
 * 描述：计划安排
 */

// 定义组件（ES6）
class Plan extends Component {

    state = {
        listLoading: false,
        datas: [],
        outhtml: [],
        filters: {
            date: ""
        },
    }

    /**
     * 获取计划列表数据
     * @returns {Promise<void>}
     */
    getDatas = async () => {
        let _this = this
        let filters = _this.state.filters
        let para = {
            date: filters.date,
        };
        // 在发请求前, 显示loading
        _this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await queryPlan(para);
        // 在请求完成后, 隐藏loading
        _this.setState({listLoading: false});
        if (code === 0) {
            // 表格数据
            _this.setState({datas: data}, function () {
                _this.rendering()
            });
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    };

    rendering = () => {
        var isNowMonth = true;
        // 判断是否是本月
        var nowDate = new Date(this.getNowFormatDate());
        var nowYear = nowDate.getFullYear()//获取年
        var nowMonth = nowDate.getMonth();//获取月
        var nowday = nowDate.getDate();//获取天数
        var localDate = new Date(this.state.filters.date);
        var localYear = localDate.getFullYear()//获取年
        var localMonth = localDate.getMonth();//获取月
        var editDate = localYear + '-' + (localMonth + 1) + '-'
        if ((nowYear === localYear) && (nowMonth === localMonth)) {
            isNowMonth = true
        } else {
            isNowMonth = false
        }
        // 开始渲染
        var outhtml = [];//输出具体的日历
        var _thisLine = [];//处理的每一行
        var lineNum = 0;//行号
        for (var i = 0; i < this.state.datas.length; i++) {
            const item = this.state.datas[i]
            const cellNum = i % 7
            if (cellNum === 0) {
                // 行开始
                _thisLine = []
                lineNum++
            }
            if (item.flog === 1) {
                // 需要渲染日历
                // 判断该天有无安排计划
                if (item.value === 0) {
                    // 没有安排计划
                    // 判断当前单元格是否是今天
                    if (isNowMonth === true && nowday === item.number) {
                        _thisLine.push(<td key={i} onClick={this.clickTD} data-id={item.id}
                                           data-key={editDate + item.number} className="today">{item.number}</td>)
                    } else {
                        _thisLine.push(<td key={i} onClick={this.clickTD} data-id={item.id}
                                           data-key={editDate + item.number}>{item.number}</td>)
                    }
                } else {
                    // 有计划
                    _thisLine.push(<td key={i} onClick={this.clickTD} className="havetoday" data-id={item.id}
                                       data-key={editDate + item.number} data-value={item.value}>{item.number}</td>)
                }
            } else {
                // 显示1号前和月尾的空白单元格
                _thisLine.push(<td key={i}></td>)
            }
            if (cellNum === 6) {
                outhtml.push(<tr key={lineNum}>{_thisLine}</tr>)
            }
        }
        this.setState({
            outhtml
        })
    };

    /**
     * 获取当前日期
     * @returns {string}
     */
    getNowFormatDate = () => {
        var date = new Date()
        var seperator1 = '-'
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var strDate = date.getDate()
        if (month >= 1 && month <= 9) {
            month = '0' + month
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = '0' + strDate
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate
    };

    /**
     * 日期加减运算
     * @param _dateObject
     * @param x
     * @returns {string}
     */
    getOperationData = (_dateObject, x) => {
        //运算日期
        if (_dateObject === null || undefined === _dateObject || _dateObject === '') {
            _dateObject = new Date();
        }
        _dateObject.setMonth(_dateObject.getMonth() + x);
        var nd = _dateObject.valueOf();
        nd = new Date(nd);
        var y = nd.getFullYear();
        var m = nd.getMonth() + 1;
        var d = nd.getDate();
        if (m <= 9) m = '0' + m;
        if (d <= 9) d = '0' + d;
        var cdate = y + '-' + m + '-01';
        return cdate;
    }

    /**
     * 日期加减事件
     * @param flog
     */
    buttonQuery = (flog) => {
        let _this = this
        // 通过上一个月，下一个月进行日期查询
        let filters = _this.state.filters
        filters.date = _this.getOperationData(new Date(filters.date), flog)
        _this.setState({filters}, function () {
            _this.getDatas()
        })
    };

    /**
     * 单击单元格事件
     * @param e
     */
    clickTD = (e) => {
        let _this = this;
        // 得到自定义属性
        // 得到计划的主键，没有计划时为-1
        let id = e.currentTarget.getAttribute('data-id')
        // 得到当天的时间
        if (id === -1 || id === '-1') {
            // 该天无计划
            return
        } else {
            // 该天有计划
            let value = e.currentTarget.getAttribute('data-value')
            _this.notice(value)
        }
    };

    notice = content => {
        Modal.info({
            title: '安排内容',
            content: (
                content
            ),
            onOk() {
            },
        });
    }

    /*
     * 为第一次render()准备数据
     * 因为要异步加载数据，所以方法改为async执行
     */
    componentWillMount() {
        let filters = this.state.filters
        filters.date = this.getNowFormatDate()
        this.setState({
            filters
        })
    }

    /*
    执行异步任务: 发异步ajax请求
    */
    componentDidMount() {
        // 加载页面数据
        this.getDatas();
    };

    render() {
        const {outhtml, listLoading, filters} = this.state;
        return (
            <DocumentTitle title="日程安排">
                <div className="base-content">
                    <div className="child-container">
                        <div className="menu-title">
                            <div className="menu-name">
                                日程安排
                            </div>
                        </div>
                        <div className='switch-date'>
                            <div
                                style={{float: 'left',width: '30%',height: '100%',textAlign: 'left',lineHeight: '45px',cursor: 'pointer'}}>
                                <span onClick={() => this.buttonQuery(-1)}><Icon type="left" /></span>
                            </div>
                            <div
                                style={{float: 'left',width: '40%',height: '100%',textAlign: 'center',lineHeight: '45px',fontSize: '20px'}}>
                                {filters.date}
                            </div>
                            <div
                                style={{float: 'right',width: '28%',height: '100%',textAlign: 'right',lineHeight: '45px',cursor: 'pointer'}}>
                                <span onClick={() => this.buttonQuery(+1)}><Icon type="right" /></span>
                            </div>
                        </div>
                        <div className="plantanle">
                                {listLoading === true ? <Spin/> :
                                    <table border="1px" cellPadding="0" cellSpacing="0">
                                        <thead>
                                        <tr>
                                            <td>星期日</td>
                                            <td>星期一</td>
                                            <td>星期二</td>
                                            <td>星期三</td>
                                            <td>星期四</td>
                                            <td>星期五</td>
                                            <td>星期六</td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {outhtml}
                                        </tbody>
                                    </table>
                                }
                        </div>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}

// 对外暴露
export default Plan;