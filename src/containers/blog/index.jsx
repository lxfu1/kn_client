import React, { Component } from 'react'
import {Button, message} from 'antd'
import style from './style.scss'
import resource from 'util/resource'
import {HOST} from 'micro'
import ReactUeditor from 'ifanrx-react-ueditor'

export default class Blob extends Component {
    constructor(props) {
        super(props);
        this.state = {
            types: [],
            sendData: {
                title: '',
                type: '',
                introduction: ''
            }
        }
    }

    componentDidMount() {
        this.getTypes();
    }

    /**
     * 获取所有类型
     * */
    getTypes = () => {
        resource.get('/kn/articleTypes').then(res => {
            if (res.status === 200) {
                res.data.unshift({id: 'only', text: '全部', types: ''})
                this.setState({
                    types: res.data
                })
            } else {
                message.warning(res.message);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    /**
     * 添加文章
     * */
    addArticle = () => {
        let {sendData} = this.state;
        let params = new FormData();
        let file = document.getElementById("file").files[0]; // js 获取文件对象
        params.append('file', file);
        for(let key in sendData){
            if(sendData.hasOwnProperty(key)){
                params.append(key, sendData[key]);
            }
        }
        params.append('detail', this.ueditor.getContent());
        resource.post('/kn/addArticle', params).then(res => {
            if (res.status === 200) {
                message.success('添加成功');
                this.clear();
            } else {
                message.warning(res.message);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    setSendData = (name, value) => {
        let {sendData} = this.state;
        sendData[name] = value;
        this.setState({
            sendData
        })
    }

    getUeditor = ref => {
        this.ueditor = ref;
    }

    clear = () => {
        this.ueditor.execCommand('cleardoc');
        document.getElementById("file").value = '';
        this.setState({
            sendData: {
                title: '',
                type: '',
                introduction: ''
            }
        })
    }

    uploadImage = e => {
        return new Promise(function (resolve, reject) {
            let file = e.target.files[0];
            let params = new FormData();
            params.append('file', file);
            resource.post('/kn/upload', params).then(res => {
                if (res.status === 200) {
                    resolve(HOST + res.data.fileUrl);
                } else {
                    message.warning(res.message);
                }
            }).catch(err => {
                console.log(err);
            })
        })
    }

    render() {
        const {types, sendData} = this.state;
        return (
            <div className={style.container}>
                <div className={style.options}>
                    <div className={style.group}>
                        <span>标题：</span>
                        <input type="text"
                               value={sendData.title}
                               onChange={(e)=>{this.setSendData('title', e.target.value)}}
                        />
                    </div>
                    <div className={style.group}>
                        <span>类型：</span>
                        <select  value={sendData.type}
                                 onChange={(e)=>{this.setSendData('type', e.target.value)}}>
                            {
                                types.map(item => {
                                    return <option key={item.id} value={item.type}>{item.text}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className={style.group}>
                        <span>简介：</span>
                        <textarea value={sendData.introduction}
                               onChange={(e)=>{this.setSendData('introduction', e.target.value)}}/>
                    </div>
                    <div className={style.controls}>
                        <div className={style.group}>
                            <span>略缩图：</span>
                            <input id="file" type="file" />
                        </div>
                        <div className={style.btns}>
                            <Button onClick={this.clear}>取消</Button>
                            <Button type="primary" onClick={this.addArticle}>确认</Button>
                        </div>
                    </div>
                </div>
                <ReactUeditor
                    getRef={this.getUeditor}
                    config={{
                        zIndex: 99,
                        sourceEditor: false,
                        autoHeightEnabled: false,
                        initialFrameHeight: 250,
                        initialFrameWidth: 1170
                    }}
                    plugins={['uploadImage', 'insertCode']}
                    uploadImage={this.uploadImage}
                    ueditorPath="lib/ueditor"
                    value=""
                />
            </div>
        )
    }
}
