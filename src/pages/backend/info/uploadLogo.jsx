import React, {Component} from 'react';
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import {Modal} from 'antd';
import './uploadLogo.less';
import {uploadLogo} from "../../../api";
import {openNotificationWithIcon} from "../../../utils/window";
import memoryUtils from "../../../utils/memoryUtils";
/*
 * 文件名：uploadLogo.jsx
 * 作者：liunengkai
 * 创建日期：2019-07-14 - 22:04
 * 描述：
 * 参考：https://www.jianshu.com/p/eeaa9fba56d0
 */

// 定义组件（ES6）
class UploadLogo extends Component {

    state = {
        modalVisible: false,//模态框
        confirmLoading: false,//上传的load
        src: null,//文件路径（选择的）
        headerImage: '',//文件名后才能
    };

    componentWillMount() {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            const dataURL = e.target.result;
            this.setState({src: dataURL})
        };
        // 从本地缓存取出当前用户的logo
        const user = memoryUtils.user;
        const headerImage = user.logo;
        this.setState({
            headerImage
        });
        let file = this.props.uploadedImageFile;
        if (file) {
            fileReader.readAsDataURL(this.props.uploadedImageFile)
        }
    }

    //选择图片
    handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            //文件最多不能超过5M
            if (file.size / 1024 <= 5 * 1024) {
                const reader = new FileReader();
                reader.onload = () => {
                    this.setState({
                        src: reader.result
                    }, () => {
                        this.setState({
                            modalVisible: true,
                        })
                    })
                };
                reader.readAsDataURL(file);

            } else {
                openNotificationWithIcon("error", "文件过大", "所选文件不能超过5M");
            }
        } else {
            openNotificationWithIcon("error", "上传提示", "请选择文件");
        }

        e.target.value = ''
    };

    //保存裁切
    saveCropperImg = () => {
        let _this = this;
        // 用户未选择
        if (_this.cropper.getCroppedCanvas() === 'null') {
            return false
        }
        // this.setState({
        //     confirmLoading: true,
        // });
        // Crop
        const croppedCanvas = _this.cropper.getCroppedCanvas();
        // Round
        var roundedCanvas = _this.getRoundedCanvas(croppedCanvas);
        //获取Canvas图片，base64
        let headerImage = roundedCanvas.toDataURL();
        _this.setState({
            headerImage
        }, function () {
            // 执行图片上传
            _this.upload(headerImage)
        })
    };

    upload = async (image) => {
        let _this = this;
        _this.setState({
            confirmLoading: true,
        });
        //这边写图片的上传
        let para = {
            'logo': image.toString()
        };
        const result = await uploadLogo(para);
        _this.setState({
            confirmLoading: false,
        });
        let {msg, code} = result;
        if (code === 0) {
            openNotificationWithIcon("success", "上传结果", "上传成功");
            _this.setState({
                modalVisible: false,
            });
        } else {
            openNotificationWithIcon("error", "上传结果", msg);
        }
    };

    // 裁剪一个圆形的图片
    getRoundedCanvas = (sourceCanvas) => {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var width = sourceCanvas.width;
        var height = sourceCanvas.height;
        canvas.width = width;
        canvas.height = height;
        context.imageSmoothingEnabled = true;
        context.drawImage(sourceCanvas, 0, 0, width, height);
        context.globalCompositeOperation = 'destination-in';
        context.beginPath();
        context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
        context.fill();
        return canvas;
    };

    //取消裁切
    cancelCropper = () => {
        this.setState({
            modalVisible: false,
        });
    };


    render() {
        // 读取状态数据
        const {headerImage, modalVisible, confirmLoading, src} = this.state;
        return (
            <div className='upload-cropper'>
                {/* 选择图片按钮 */}
                <div className="show">
                    <div className="picture" style={{backgroundImage: 'url(' + headerImage + ')'}}></div>
                </div>
                <div className="upload-box">
                    <span className="upload-span" role="button">
                      <input
                          type="file"
                          accept="image/*"
                          className="base-upload-input"
                          onChange={this.handleFileChange}
                      />
                      <div className="button">
                        <div>选择</div>
                      </div>
                    </span>
                </div>


                {/* 裁切图片modal框 */}
                <Modal
                    title="图片裁切"
                    width="70vw"
                    closable={false}
                    destroyOnClose={true}
                    visible={modalVisible}
                    onOk={this.saveCropperImg}
                    confirmLoading={confirmLoading}
                    onCancel={this.cancelCropper}>
                    <div className="cropperModal">
                        <Cropper
                            ref={cropper => this.cropper = cropper}
                            src={src}//图片路径，即是base64的值，在Upload上传的时候获取到的
                            style={{height: 400, width: '100%'}}
                            preview='.cropper-preview'
                            className="company-cropper"
                            viewMode={1} //定义cropper的视图模式
                            zoomable={true} //是否允许放大图像
                            aspectRatio={this.props.aspectRatio} //image的纵横比1:1
                            guides={false} //显示在裁剪框上方的虚线
                            background={false} //是否显示背景的马赛克
                            rotatable={true} //是否旋转
                        />
                        <div className='preview-button'>
                            <div className="cropper-preview" style={{
                                borderRadius: '50%',
                                height: 100,
                                width: '100%'
                            }}></div>
                        </div>

                    </div>

                </Modal>

            </div>
        )
    }

}

// 对外暴露
export default UploadLogo;