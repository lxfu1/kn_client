// zhouke 2017/12/15  信用动态
import React, { Component } from 'react';
import { Facebook } from 'react-content-loader';
import { Link } from 'react-router-dom';
import { message, Icon } from 'antd';
import moment from 'moment';
import { HOST } from 'micro';
import resource from 'util/resource';
import styles from './styles.scss';
import HD from 'static/images/hd.png';

class articleDetail extends Component {
    constructor(props) {
        super(props);
        this.id = this.props.match.params.articleId;
        this.state = {
            data: {},
            replay: [],
            loading: true,
            commnet: ''
        };
    }

    componentDidMount() {
        this.getDetail(this.id);
        this.getComments(this.id);
    }

    getComments = articleId => {
        resource
            .get(`/kn/commentList/${articleId}`)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        replay: res.data.rows,
                        total: res.data.count,
                        loading: false
                    });
                } else {
                    this.setState({
                        loading: false
                    });
                }
            })
            .catch(err => {
                message.error('程序出了点问题，客官请稍后访问');
                this.setState({
                    loading: false
                });
            });
    };

    // 添加评论
    sendComments = rep => {
        let userId = sessionStorage.getItem('token');
        if (!userId) {
            message.warning('请先登录');
            return;
        }
        const comments = this.comments.value;
        if (!comments) {
            message.warning('请输入评论内容');
            return;
        }
        const articleId = this.id;
        const replayId = rep;
        resource
            .post(`/kn/addComments`, { comments, articleId, replayId })
            .then(res => {
                if (res.status === 200) {
                    message.success('评论成功');
                    this.clear();
                    this.getComments(articleId);
                } else {
                    message.warning(res.message);
                }
            })
            .catch(err => {
                message.error('程序出了点问题，客官请稍后访问');
                console.log(err);
            });
    };

    getDetail = articleId => {
        resource
            .get(`/kn/getArticleDetail/${articleId}`)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        data: res.data
                    });
                }
            })
            .catch(err => {
                message.error('程序出了点问题，客官请稍后访问');
                console.log(err);
            });
    };

    setDefault = e => {
        e.target.setAttribute('src', HD);
    };

    clear = e => {
        this.comments.value = '';
    };

    render() {
        const { data, loading, replay, total } = this.state;

        return (
            <div className={styles.container}>
                <div className={styles.innner}>
                    <div className={styles.articleHeader}>
                        <h5>{data.title}</h5>
                    </div>
                    <div className={styles.author}>
                        <span>
                            {moment(data.updateTime).format(
                                'YYYY-MM-DD hh:mm:ss a'
                            )}
                        </span>
                    </div>
                    <article
                        dangerouslySetInnerHTML={{ __html: data.detail }}
                    />
                </div>
                <div className={styles.comments}>
                    <textarea
                        name=""
                        cols="30"
                        rows="10"
                        ref={e => {
                            this.comments = e;
                        }}
                        placeholder="写下你的评论..."
                    />
                    <div className={styles.btns}>
                        <span className={styles.cancel} onClick={this.clear}>
                            取消
                        </span>
                        <span
                            className={styles.sendComments}
                            onClick={() => {
                                this.sendComments('');
                            }}
                        >
                            发送
                        </span>
                    </div>
                </div>
                {loading ? (
                    <Facebook />
                ) : (
                    <div className={styles.commentsList}>
                        <h4>{total || 0}条评论</h4>
                        <div className={styles.result}>
                            {replay.map(item => {
                                return (
                                    <div
                                        key={item.commentId}
                                        className={styles.replayComment}
                                    >
                                        <header>
                                            <Link
                                                to={`/main/personal/${
                                                    item.user.userId
                                                }`}
                                            >
                                                <img
                                                    src={
                                                        HOST + item.user.headUrl
                                                    }
                                                    onError={this.setDefault}
                                                    alt=""
                                                />
                                            </Link>
                                            <div className={styles.userInfo}>
                                                <Link
                                                    to={`/main/personal/${
                                                        item.user.userId
                                                    }`}
                                                >
                                                    <p>{item.user.username}</p>
                                                </Link>

                                                <span>
                                                    {moment(
                                                        item.commentTime
                                                    ).format(
                                                        'YYYY-MM-DD hh:mm:ss a'
                                                    )}
                                                </span>
                                            </div>
                                        </header>
                                        <div>
                                            <p className={styles.commentLabel}>
                                                {item.comments}
                                            </p>
                                            {/* <span className={styles.rep}>
                                                <Icon type="message" />
                                                回复
                                            </span> */}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default articleDetail;
