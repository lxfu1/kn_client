import React, { Component } from 'react';
import { Button, message, Modal } from 'antd';
import style from './style.scss';
import resource from '@/util/resource';
import { HOST } from '@/constants/storage';
import ReactUeditor from 'ifanrx-react-ueditor';

export default class ArticleEdit extends Component {
    constructor(props) {
        super(props);

        this.articleId = this.props.match.params.id;
        this.state = {
            types: [],
            show: false,
            typeName: '',
            fileUrl: '',
            sendData: {
                title: '',
                type: '',
                introduction: '',
                detail: ''
            }
        };
    }

    componentDidMount() {
        this.getTypes();
        this.getArticleContext();
    }

    getArticleContext = () => {
        if (!this.articleId) {
            window.history.back();
            return;
        }
        resource.get(`/kn/getArticleDetail/${this.articleId}`).then(res => {
            if (res.status === 200) {
                const _data = res.data;
                const sendData = {
                    title: _data.title,
                    type: _data.label.labelId,
                    introduction: _data.introduction,
                    detail: _data.detail
                };
                this.setState({ sendData: sendData, fileUrl: _data.fileUrl });
            }
        });
    };

    /**
     * 获取所有类型
     * */
    getTypes = () => {
        resource
            .get('/kn/articleTypes')
            .then(res => {
                if (res.status === 200) {
                    res.data.unshift({ id: 'only', text: '全部', types: '' });
                    this.setState({
                        types: res.data
                    });
                } else {
                    message.warning(res.message);
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    /**
     * 添加文章
     * */
    addArticle = () => {
        let { sendData } = this.state;
        let params = new FormData();
        let file = document.getElementById('file').files[0]; // js 获取文件对象
        params.append('file', file);

        for (let key in sendData) {
            if (sendData.hasOwnProperty(key)) {
                params.append(key, sendData[key]);
            }
        }

        params.append('articleId', this.articleId);

        resource
            .put('/kn/updateArticleAdmin', params)
            .then(res => {
                if (res.status === 200) {
                    message.success('添加成功');
                    this.clear();
                } else {
                    message.warning(res.message);
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    setSendData = (name, value) => {
        let { sendData } = this.state;
        sendData[name] = value;
        this.setState(
            {
                sendData
            },
            () => {
                console.log(this.state.sendData);
            }
        );
    };

    getUeditor = ref => {
        this.ueditor = ref;
    };

    clear = () => {
        this.ueditor.execCommand('cleardoc');
        document.getElementById('file').value = '';
        this.setState({
            sendData: {
                title: '',
                type: '',
                introduction: ''
            }
        });
    };

    uploadImage = e => {
        return new Promise(function(resolve, reject) {
            let file = e.target.files[0];
            let params = new FormData();
            params.append('file', file);
            resource
                .post('/kn/upload', params)
                .then(res => {
                    if (res.status === 200) {
                        resolve(HOST + res.data.fileUrl);
                    } else {
                        message.warning(res.message);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        });
    };

    setShow = () => {
        this.setState({
            show: true
        });
    };

    handleOk = () => {
        let { typeName } = this.state;
        resource
            .post('/kn/addLabel', { labelName: typeName })
            .then(res => {
                if (res.status === 200) {
                    this.setState(
                        {
                            show: false,
                            typeName: ''
                        },
                        () => {
                            this.getTypes();
                        }
                    );
                } else {
                    message.warning(res.message);
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    handleCancel = () => {
        this.setState({
            show: false
        });
    };

    uploadTitleImg = () => {
        let file = document.getElementById('file').files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
            let src = e.target.result;
            this.setState({
                fileUrl: src
            });
        };
    };

    render() {
        const { types, sendData, show, typeName, fileUrl } = this.state;

        return (
            <div className={style.container}>
                <div className={style.options}>
                    <div className={style.group}>
                        <span>标题：</span>
                        <input
                            type="text"
                            value={sendData.title}
                            onChange={e => {
                                this.setSendData('title', e.target.value);
                            }}
                        />
                    </div>
                    <div className={style.group}>
                        <span>类型：</span>
                        <select
                            value={sendData.type}
                            onChange={e => {
                                this.setSendData('type', e.target.value);
                            }}
                        >
                            {types.map((item, index) => {
                                return (
                                    <option key={item.labelId + index} value={item.labelId}>
                                        {item.text}
                                    </option>
                                );
                            })}
                        </select>
                        <label className={style.addType} onClick={this.setShow}>
                            类型不足？
                        </label>
                    </div>
                    <div className={style.group}>
                        <span>简介：</span>
                        <textarea
                            value={sendData.introduction}
                            onChange={e => {
                                this.setSendData('introduction', e.target.value);
                            }}
                        />
                    </div>
                    <div className={style.controls}>
                        <div className={style.group}>
                            <span>略缩图：</span>
                            <img
                                className={style.slt}
                                src={fileUrl.indexOf('data:') < 0 ? `${HOST}${fileUrl}` : fileUrl}
                                alt=""
                            />
                            <input id="file" type="file" onChange={this.uploadTitleImg} />
                        </div>
                        <div className={style.btns}>
                            <Button onClick={this.clear}>取消</Button>
                            <Button type="primary" onClick={this.addArticle}>
                                确认
                            </Button>
                        </div>
                    </div>
                </div>
                <ReactUeditor
                    getRef={this.getUeditor}
                    config={{
                        sourceEditor: false,
                        autoHeightEnabled: false,
                        initialFrameHeight: 250,
                        initialFrameWidth: 1170
                    }}
                    plugins={['uploadImage', 'insertCode']}
                    uploadImage={this.uploadImage}
                    ueditorPath={process.env.NODE_ENV === 'development' ? 'static/lib/ueditor' : 'lib/ueditor'}
                    onChange={text => {
                        let sendData = this.state.sendData;
                        sendData.detail = text;

                        this.setState({
                            sendData: sendData
                        });
                    }}
                    value={sendData.detail}
                />
                <Modal
                    title="类型添加"
                    visible={show}
                    onOk={this.handleOk}
                    okText="确认"
                    cancelText="取消"
                    onCancel={this.handleCancel}
                >
                    <div className={style.group}>
                        <span>类型：</span>
                        <input
                            type="text"
                            className="inputType"
                            value={typeName}
                            onChange={e => {
                                this.setState({ typeName: e.target.value });
                            }}
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}
