import React, {Component} from 'react';
import {Button, Col, DatePicker, Icon, Form, Row} from "antd";
import DocumentTitle from 'react-document-title'
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-08-19 - 22:36
 * 描述：计划管理
 */
const {RangePicker} = DatePicker;

// 定义组件（ES6）
class Plan extends Component {

    state = {
        filters: {
            date: null
        }
    }


    render() {
        const {date} = this.state;
        return (
            <DocumentTitle title="日程安排">
                <section>
                    <Row>
                        <Col span={24} className="toolbar">
                            <Form layout="inline">
                                <Form.Item>
                                    <RangePicker value={date} onChange={this.onChangeDate}/>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="button">
                                        <Icon type="reload"/>重置
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <div
                                style="float: left;width: 30%;height: 100%;text-align: left;line-height: 45px;cursor: pointer;">
                                <span v-on:click="buttonQuery(-1)"><i className="el-icon-arrow-left"></i></span></div>
                            <div
                                style="float: left;width: 40%;height: 100%;text-align: center;font-size: 20px;line-height: 45px">
                                {{
                                this
                                .filters.date
                            }}</div>
                            <div
                                style="float: right;width: 28%;height: 100%;text-align: right;line-height: 45px;cursor: pointer;">
                                <span v-on:click="buttonQuery(+1)"><i className="el-icon-arrow-right"></i></span></div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <table id="plantanle" border="1px" cellpadding="0" cellspacing="0" :loading="listLoading">
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
                                <tbody id="Tdhaoshu" v-html="outhtml" @click="planClick($event)">
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </section>
            </DocumentTitle>
        );
    }
}

// 对外暴露
export default Plan;