import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { message } from 'antd';
import style from './style.scss';
import resource from '@/util/resource';
import { HOST } from '@/constants/storage';
import HD from 'static/images/hd.png';

class Recommend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            author: [],
            userId: sessionStorage.getItem('token') || ''
        };
    }

    componentDidMount() {
        this.getAuthor();
    }

    getAuthor = () => {
        resource
            .get(`/kn/recommendAuthor`)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        author: res.data
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

    handleCare = item => {
        if (!sessionStorage.getItem('token')) {
            message.warning('请先登录');
            return;
        }
        const { userId } = this.state;
        const status = this.isAttentioned(item, userId) ? 2 : 1;
        resource.get(`/kn/attention/${item.userId}/${status}`).then(res => {
            if (res.status === 200) {
                message.success(status === 2 ? '取消关注成功' : '关注成功');
                this.getAuthor();
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

    render() {
        const { author, userId } = this.state;
        return (
            <div className={style.container}>
                <h5>推荐作者</h5>
                {author.length ? (
                    author.map(item => {
                        return (
                            <div key={item.userId} className={style.flexRow}>
                                <div className={style.flexEnd}>
                                    <Link to={`/main/personal/${item.userId}`}>
                                        <img src={HOST + item.headUrl} onError={this.setDefault} alt="" />
                                    </Link>
                                    <div className={style.inner}>
                                        <p className={style.title}>
                                            <Link to={`/main/personal/${item.userId}`}>{item.username}</Link>
                                        </p>
                                        <p>
                                            发表文章： {item.articleCount}，评论： {item.commentCount}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={style.attention}
                                    title={this.isAttentioned(item, userId) ? '取消关注' : '+关注'}
                                    style={{
                                        color: this.isAttentioned(item, userId) ? '#ccc' : '#42c02e'
                                    }}
                                    onClick={() => this.handleCare(item)}
                                >
                                    {this.isAttentioned(item, userId) ? '已关注' : '+关注'}
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <p>加载中.....</p>
                )}
                <Link className={style.showAll} to="/main/rcAuthor">
                    查看全部
                    <b>&gt;</b>
                </Link>
            </div>
        );
    }
}

export default Recommend;
