import React, { Component } from 'react';
import { message, Tabs, Icon, Modal, Input } from 'antd';
import Article from './subpage/article';
import Attention from './subpage/attention';
import Follower from './subpage/follower';
import style from './style.scss';
import resource from 'resource';
import { HOST } from 'micro';
import HD from 'static/images/hd.png';

const { TextArea } = Input;
const TabPane = Tabs.TabPane;
class Personal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.match.params.userId,
            authorInfo: {},
            articleCount: 0,
            visible: false,
            confirmLoading: false,
            loading: false,
            imageUrl: '',
            backUp: {},
            change: false
        };
    }

    componentDidMount() {
        this.getAuthorInfo();
    }

    getAuthorInfo = () => {
        let { userId } = this.state;
        resource
            .get(`/kn/getAuthorInfo/${userId}`)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        authorInfo: res.data,
                        change: false,
                        backUp: {
                            ...JSON.parse(JSON.stringify(res.data))
                        }
                    });
                }
            })
            .catch(err => {
                console.log(err);
                message.error('程序出了点问题，客官请稍后访问');
            });
    };

    callback = key => {
        console.log(key);
    };

    articleCount = count => {
        this.setState({
            articleCount: count || 0
        });
    };

    showModal = () => {
        this.setState({
            visible: true
        });
    };

    handleOk = () => {
        this.setState({
            confirmLoading: true
        });
        let { backUp } = this.state;
        let { userId } = this.state;
        let params = new FormData();
        let file = document.getElementById('file').files[0]; // js 获取文件对象
        params.append('file', file);

        for (let key in backUp) {
            if (backUp.hasOwnProperty(key)) {
                params.append(key, backUp[key]);
            }
        }

        resource
            .put('/kn/updatePersonalInfo', params)
            .then(res => {
                if (res.status === 200) {
                    message.success('修改成功');
                    this.setState({
                        visible: false,
                        confirmLoading: false
                    });
                    this.getAuthorInfo();
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
            visible: false
        });
    };

    setData = (e, type) => {
        let { backUp } = this.state;
        backUp[type] = e.target.value;
        this.setState({ backUp });
    };

    uploadTitleImg = () => {
        let { backUp } = this.state;
        let file = document.getElementById('file').files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
            let src = e.target.result;
            backUp.headUrl = src;
            this.setState({
                backUp,
                change: true
            });
        };
    };

    setDefault = e => {
        e.target.setAttribute('src', HD);
    };

    render() {
        const {
            authorInfo,
            articleCount,
            visible,
            confirmLoading,
            backUp,
            change,
            userId
        } = this.state;
        const showEdit = userId && userId !== sessionStorage.getItem('token');
        return (
            <div className={style.container}>
                <div className={style.left}>
                    <div className={style.info}>
                        <div className={style.headerImage}>
                            <img
                                src={HOST + authorInfo.headUrl}
                                onError={this.setDefault}
                                alt=""
                            />
                            {showEdit ? null : (
                                <span onClick={this.showModal}>编辑</span>
                            )}
                        </div>
                        <div className={style.counts}>
                            <p className={style.name}>{authorInfo.username}</p>
                            <div className={style.labels}>
                                <div className={style.label}>
                                    <b>{articleCount}</b>
                                    <p>文章</p>
                                </div>
                                <div className={style.label}>
                                    <b>
                                        {authorInfo.attention &&
                                        authorInfo.attention.followedUser
                                            ? authorInfo.attention.followedUser.split(
                                                  '&'
                                              ).length
                                            : 0}
                                    </b>
                                    <p>关注</p>
                                </div>
                                <div className={style.label}>
                                    <b>
                                        {authorInfo.attention &&
                                        authorInfo.attention.follower
                                            ? authorInfo.attention.follower.split(
                                                  '&'
                                              ).length
                                            : 0}
                                    </b>
                                    <p>粉丝</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Tabs defaultActiveKey="article" onChange={this.callback}>
                        <TabPane
                            tab={
                                <span>
                                    <Icon type="file-protect" />文章
                                </span>
                            }
                            key="article"
                        >
                            <Article
                                userId={userId}
                                callback={this.articleCount}
                            />
                        </TabPane>
                        <TabPane
                            tab={
                                <span>
                                    <Icon type="heart" />关注
                                </span>
                            }
                            key="attention"
                        >
                            <Attention
                                userId={userId}
                                refreshList={this.getAuthorInfo}
                            />
                        </TabPane>
                        <TabPane
                            tab={
                                <span>
                                    <Icon type="user" />粉丝
                                </span>
                            }
                            key="follower"
                        >
                            <Follower userId={userId} />
                        </TabPane>
                    </Tabs>
                </div>
                <div className={style.right}>
                    <div className={style.describe}>
                        <span>个人简介</span>
                        <p>{authorInfo.describe || '暂无'}</p>
                    </div>
                </div>
                <Modal
                    title="个人信息修改"
                    visible={visible}
                    style={{ top: 20 }}
                    onOk={this.handleOk}
                    okText="确认"
                    cancelText="取消"
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <div className={style.group}>
                        <span>昵称：</span>
                        <Input
                            placeholder="昵称"
                            value={backUp.username}
                            onChange={e => {
                                this.setData(e, 'username');
                            }}
                        />
                    </div>
                    <div className={style.group}>
                        <span>个人简介:</span>
                        <TextArea
                            placeholder="个人简介"
                            value={backUp.describe}
                            rows="4"
                            onChange={e => {
                                this.setData(e, 'describe');
                            }}
                        />
                    </div>
                    <div className={style.group}>
                        <span>头像:</span>
                        <div className={style.imgbox}>
                            <img
                                src={
                                    change
                                        ? backUp.headUrl
                                        : HOST + backUp.headUrl
                                }
                                alt=""
                            />
                            <input
                                id="file"
                                type="file"
                                onChange={this.uploadTitleImg}
                            />
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Personal;
