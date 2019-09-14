import React, {Component} from 'react';
import DocumentTitle from 'react-document-title'
import {Col, Row} from "antd";
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts'
import 'echarts-wordcloud'
import {getDashBoard} from "../../../api";
import {openNotificationWithIcon} from "../../../utils/window";
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-09-01 - 16:23
 * 描述：平台监控
 */

// 定义组件（ES6）
class DashBoard extends Component {


    state = {
        // 是否显示加载
        listLoading: false,
        chartWord: {},
        chartColumn: {},
        chartBar: {},
        chartLine: {},
        chartPie: {},
        activeLine: {},
        boardColumn: {},
        data: {
            newsCount: 11,
            guestCount: 6,
            pictureCount: 2,
            fileCount: 1,
            logCount: 61,
            notesCount: 0,
            planCount: 15,
            bookCount: 3,
            bookList: [{
                "name": "测试-1",
                "notesCount": 2,
            }, {
                "name": "测试",
                "notesCount": 4,
            }, {
                "name": "测试",
                "notesCount": 2,
            }],
            financial6: [{
                "deposited": 4137.56,
                "expenditure": 630.49,
                "tradeDate": "2018-09",
                "currencyNumber": 5771.05
            }, {
                "deposited": 4153.0,
                "expenditure": 2433.63,
                "tradeDate": "2018-10",
                "currencyNumber": 6586.63
            }, {
                "deposited": 5153.88,
                "expenditure": 9012.42,
                "tradeDate": "2018-11",
                "currencyNumber": 14166.3
            }, {
                "deposited": 4153.0,
                "expenditure": 5842.86,
                "tradeDate": "2018-12",
                "currencyNumber": 9981.87
            }, {
                "deposited": 17841.46,
                "expenditure": 1433.34,
                "tradeDate": "2019-01",
                "currencyNumber": 19274.7
            }, {
                "deposited": 8708.88,
                "expenditure": 3809.92,
                "tradeDate": "2019-02",
                "currencyNumber": 12518.8
            }],
            log6: {
                "2018-09": 34,
                "2018-10": 45,
                "2018-11": 23,
                "2018-12": 34,
                "2019-01": 47,
                "2019-02": 50
            },
            files6: {
                "2018-09": 5,
                "2018-10": 3,
                "2018-11": 6,
                "2018-12": 5,
                "2019-01": 7,
                "2019-02": 9
            },
            news6: {
                "2018-09": 2,
                "2018-10": 4,
                "2018-11": 5,
                "2018-12": 3,
                "2019-01": 3,
                "2019-02": 1
            },
            board: {
                "2018-09": 1,
                "2018-10": 3,
                "2018-11": 2,
                "2018-12": 1,
                "2019-01": 3,
                "2019-02": 2
            },
        }
    }

    /**
     * 数据分布配置参数
     */
    drawPieChart = () => {
        let _this = this
        let {newsCount, guestCount, pictureCount, fileCount, notesCount, planCount, bookCount} = _this.state.data
        let chartPie = {
            title: {
                text: '数据分布',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['动态', '留言', '图片', '文件', '笔记', '计划', '笔记簿']
            },
            series: [
                {
                    name: '记录总数',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                        {value: newsCount, name: '动态'},
                        {value: guestCount, name: '留言'},
                        {value: pictureCount, name: '图片'},
                        {value: fileCount, name: '文件'},
                        {value: notesCount, name: '笔记'},
                        {value: planCount, name: '计划'},
                        {value: bookCount, name: '笔记簿'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
        _this.setState({chartPie})
    }

    /**
     * 近6个月财务流水
     */
    drawBarChart = () => {
        let _this = this
        let financial6 = _this.state.data.financial6
        var data = [];
        data.push(['product', '流入', '流出', '总额'])
        for (var i = 0; i < financial6.length; i++) {
            var item = financial6[i]
            data.push([item.tradeDate, item.deposited, item.expenditure, item.currencyNumber])
        }
        let chartBar = {
            title: {
                text: '近6个月财务流水',
            },
            legend: {},
            tooltip: {},
            dataset: {
                source: data
            },
            xAxis: {type: 'category'},
            yAxis: {},
            series: [
                {type: 'bar'},
                {type: 'bar'},
                {type: 'bar'}
            ]
        };
        _this.setState({chartBar})
    }

    /**
     * 列出笔记簿词云标签
     */
    drawWordChart = () => {
        let _this = this
        let bookList = _this.state.data.bookList
        if (null === bookList) {
            return
        }
        var data = [];
        for (var i = 0; i < bookList.length; i++) {
            var item = bookList[i]
            data.push({"name": item.name, "value": item.notesCount})
        }
        let chartWord = echarts.init(document.getElementById('wordCloud'));
        var maskImage = new Image();
        //重点：云彩图片的base64码
        maskImage.src = 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI1NnB4IiBoZWlnaHQ9IjI1NnB4IiB2aWV3Qm94PSIwIDAgNTQ4LjE3NiA1NDguMTc2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1NDguMTc2IDU0OC4xNzY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8cGF0aCBkPSJNNTI0LjE4MywyOTcuMDY1Yy0xNS45ODUtMTkuODkzLTM2LjI2NS0zMi42OTEtNjAuODE1LTM4LjM5OWM3LjgxLTExLjk5MywxMS43MDQtMjUuMTI2LDExLjcwNC0zOS4zOTkgICBjMC0yMC4xNzctNy4xMzktMzcuNDAxLTIxLjQwOS01MS42NzhjLTE0LjI3My0xNC4yNzItMzEuNDk4LTIxLjQxMS01MS42NzUtMjEuNDExYy0xOC4yNzEsMC0zNC4wNzEsNS45MDEtNDcuMzksMTcuNzAzICAgYy0xMS4yMjUtMjcuMDI4LTI5LjA3NS00OC45MTctNTMuNTI5LTY1LjY2N2MtMjQuNDYtMTYuNzQ2LTUxLjcyOC0yNS4xMjUtODEuODAyLTI1LjEyNWMtNDAuMzQ5LDAtNzQuODAyLDE0LjI3OS0xMDMuMzUzLDQyLjgzICAgYy0yOC41NTMsMjguNTQ0LTQyLjgyNSw2Mi45OTktNDIuODI1LDEwMy4zNTFjMCwyLjg1NiwwLjE5MSw2Ljk0NSwwLjU3MSwxMi4yNzVjLTIyLjA3OCwxMC4yNzktMzkuODc2LDI1LjgzOC01My4zODksNDYuNjg2ICAgQzYuNzU5LDI5OS4wNjcsMCwzMjIuMDU1LDAsMzQ3LjE4YzAsMzUuMjExLDEyLjUxNyw2NS4zMzMsMzcuNTQ0LDkwLjM1OWMyNS4wMjgsMjUuMDMzLDU1LjE1LDM3LjU0OCw5MC4zNjIsMzcuNTQ4aDMxMC42MzYgICBjMzAuMjU5LDAsNTYuMDk2LTEwLjcxNSw3Ny41MTItMzIuMTIxYzIxLjQxMy0yMS40MTIsMzIuMTIxLTQ3LjI0OSwzMi4xMjEtNzcuNTE1ICAgQzU0OC4xNzIsMzM5Ljc1Nyw1NDAuMTc0LDMxNi45NTIsNTI0LjE4MywyOTcuMDY1eiIgZmlsbD0iI0ZGRkZGRiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=';
        maskImage.onload = function () {
            chartWord.setOption(
                {
                    series: [
                        {
                            type: 'wordCloud',
                            shape: 'ellipse',
                            gridSize: 8,
                            textStyle: {
                                normal: {
                                    fontFamily: '微软雅黑',
                                    color: function () {
                                        var colors = ['#fda67e', '#81cacc', '#cca8ba', "#88cc81", "#82a0c5", '#fddb7e', '#735ba1', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
                                        return colors[parseInt(Math.random() * 10)];
                                    }
                                }
                            },
                            data: data
                        }
                    ]
                }
            )
        }
        _this.setState({chartWord})
    }

    /**
     * 近6个月动态发布情况
     */
    drawLineChart = () => {
        let _this = this
        let news6 = _this.state.data.news6
        var mongth = [];
        var count = [];
        for(var key in news6){
            mongth.push(key)
            count.push(news6[key])
        }
        let chartLine = {
            title: {
                text: '过去6个月动态发布情况'
            },
            tooltip: {},
            legend: {},
            xAxis: {
                type: 'category',
                data: mongth
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: count,
                type: 'line',
                smooth: true
            }]
        }
        _this.setState({chartLine})
    }

    /**
     * 过去6个月活跃情况
     */
    chartLineActive() {
        let _this = this
        let log6 = _this.state.data.log6
        var mongth = [];
        var count = [];
        for(var key in log6){
            mongth.push(key)
            count.push(log6[key])
        }
        let activeLine ={
            title: {
                text: '过去6个月活跃情况'
            },
            tooltip: {},
            legend: {},
            xAxis: {
                type: 'category',
                data: mongth
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: count,
                type: 'line',
                smooth: true
            }]
        }
        _this.setState({activeLine})
    }

    /**
     * 过去的6个月里文件上传量
     */
    drawColumnChart = () => {
        let _this = this
        let files6 = _this.state.data.files6
        var mongth =[];
        var count = [];
        for(var key in files6){
            mongth.push(key)
            count.push(files6[key])
        }
        let chartColumn = {
            title: { text: '过去的6个月里文件上传量' },
            tooltip: {},
            xAxis: {
                data: mongth
            },
            yAxis: {},
            series: [{
                name: '上传数',
                type: 'bar',
                data: count
            }]
        }
        _this.setState({chartColumn})
    }

    /**
     * 过去的6个月里网站留言量
     */
    chartBoardColumn = () => {
        let _this = this
        let board = _this.state.data.board
        var mongth = [];
        var count = [];
        for(var key in board){
            mongth.push(key)
            count.push(board[key])
        }
        let boardColumn = {
            title: { text: '过去的6个月里网站留言量' },
            tooltip: {},
            xAxis: {
                data: mongth
            },
            yAxis: {},
            series: [{
                name: '留言数',
                type: 'bar',
                data: count
            }]
        }
        _this.setState({boardColumn})
    }


    /**
     * 得到后台的统计数据，并执行渲染
     * @returns {Promise<void>}
     */
    getDatas = async () => {
        let _this = this;
        // 在发请求前, 显示loading
        _this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getDashBoard({});
        // 在请求完成后, 隐藏loading
        _this.setState({listLoading: false});
        if (code === 0) {
            _this.setState({
                data
            },function () {
                _this.drawPieChart();
                _this.drawBarChart();
                _this.drawWordChart();
                _this.drawLineChart();
                _this.chartLineActive();
                _this.drawColumnChart();
                _this.chartBoardColumn();
            });
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    };

    /*
     * 执行异步任务: 发异步ajax请求
     */
    componentDidMount() {
        // 根据本地数据进行渲染
        // this.drawPieChart();
        // this.drawBarChart();
        // this.drawWordChart();
        // this.drawLineChart();
        // this.chartLineActive();
        // this.drawColumnChart();
        // this.chartBoardColumn();
        // 获取后台数据进行渲染
        this.getDatas();
    };


    render() {
        const {chartColumn, chartBar, chartLine, chartPie, activeLine, boardColumn} = this.state;
        return (
            <DocumentTitle title='平台监控'>
                <section>
                    <Row>
                        <Col span={8}>
                            <ReactEcharts option={chartPie} lazyUpdate={true} style={{width: '100%', height: '300px'}}/>
                        </Col>
                        <Col span={11}>
                            <ReactEcharts option={chartBar} lazyUpdate={true} style={{width: '100%', height: '300px'}}/>
                        </Col>
                        <Col span={5}>
                            <div id="wordCloud" style={{width: '100%', height: '300px'}}></div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <ReactEcharts option={chartLine} lazyUpdate={true} style={{width: '100%', height: '400px'}}></ReactEcharts>
                        </Col>
                        <Col span={12}>
                            <ReactEcharts option={activeLine} lazyUpdate={true} style={{width: '100%', height: '400px'}}></ReactEcharts>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <ReactEcharts option={chartColumn} lazyUpdate={true} style={{width: '100%', height: '300px'}}></ReactEcharts>
                        </Col>
                        <Col span={12}>
                            <ReactEcharts option={boardColumn} lazyUpdate={true} style={{width: '100%', height: '300px'}}></ReactEcharts>
                        </Col>
                    </Row>
                </section>
            </DocumentTitle>
        );
    }
}

// 对外暴露
export default DashBoard;