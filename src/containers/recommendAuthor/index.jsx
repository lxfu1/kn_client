import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Facebook, Code } from 'react-content-loader';
import { message } from 'antd';
import style from './style.scss';
import resource from 'resource';
import { HOST } from 'micro';
import HD from 'static/images/hd.png';
import Recommend from './images/recommend.png';

class RecommendAuthor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            author: [],
            total: 0,
            page: 1,
            size: 12,
            loading: true,
            moreLoading: false,
            userId: sessionStorage.getItem('token') || ''
        };
    }

    componentDidMount() {
        this.getAuthor();
    }

    getAuthor = () => {
        const { page, size } = this.state;
        resource
            .get(`/kn/recommendAuthor?page=${page}&size=${size}`)
            .then(res => {
                if (res.status === 200) {
                    let { author } = this.state;
                    author = author.concat(res.data.rows);
                    this.setState({
                        author,
                        total: res.data.count,
                        loading: false,
                        moreLoading: false
                    });
                }
            })
            .catch(err => {
                console.log(err);
                message.error('程序出了点问题，客官请稍后访问');
            });
    };

    setDefault = e => {
        e.target.setAttribute('src', HD);
    };

    handleCare = (e, item) => {
        let ele = e.target;
        if (!sessionStorage.getItem('token')) {
            message.warning('请先登录');
            return;
        }
        if (item.userId === sessionStorage.getItem('token')) {
            message.warning('无法关注自己');
            return;
        }
        const status = ele.innerHTML === '已关注' ? 2 : 1;
        resource.get(`/kn/attention/${item.userId}/${status}`).then(res => {
            if (res.status === 200) {
                message.success(status === 2 ? '取消关注成功' : '关注成功');
                ele.innerHTML = status === 2 ? '+关注' : '已关注';
            }
        });
    };

    isAttentioned = (item, userId) => {
        if (!item) {
            return false;
        }
        if (!userId) {
            return false;
        }
        if (!item.attention) {
            return false;
        }
        if (!item.attention.follower) {
            return false;
        }
        return item.attention.follower.indexOf(userId) !== -1;
    };

    pageChange = e => {
        let { page } = this.state;
        page += 1;
        this.setState(
            {
                page: page,
                moreLoading: true
            },
            () => {
                this.getAuthor();
            }
        );
    };

    render() {
        const {
            author,
            userId,
            loading,
            moreLoading,
            page,
            size,
            total
        } = this.state;
        return (
            <div className={style.container}>
                <div className={style.bg}>
                    <img src={Recommend} alt="" />
                </div>
                <div className={style.warp}>
                    {loading ? (
                        <Facebook />
                    ) : (
                        author.map(item => {
                            return (
                                <div key={item.userId} className={style.common}>
                                    <div className={style.item}>
                                        <div className={style.header}>
                                            <Link
                                                to={`/main/personal/${
                                                    item.userId
                                                }`}
                                            >
                                                <img
                                                    src={HOST + item.headUrl}
                                                    onError={this.setDefault}
                                                    alt=""
                                                />
                                            </Link>
                                        </div>
                                        <Link
                                            className={style.title}
                                            to={`/main/personal/${item.userId}`}
                                        >
                                            {item.username || '未知用户'}
                                        </Link>
                                        <p className={style.describe}>
                                            {item.describe || '暂无个人简介'}
                                        </p>
                                        <span
                                            className={style.attention}
                                            onClick={e =>
                                                this.handleCare(e, item)
                                            }
                                        >
                                            {this.isAttentioned(item, userId)
                                                ? '已关注'
                                                : '+关注'}
                                        </span>
                                        <div className={style.flexEnd}>
                                            <div className={style.inner}>
                                                <p>
                                                    发表文章：{' '}
                                                    {item.articleCount}，评论：{' '}
                                                    {item.commentCount}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                {moreLoading ? <Code /> : null}
                {total > page * size ? (
                    <span className={style.showAll} onClick={this.pageChange}>
                        加载更多
                    </span>
                ) : null}
            </div>
        );
    }
}

export default RecommendAuthor;
