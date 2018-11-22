import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { message } from 'antd';
import moment from 'moment';
import style from './style.scss';
import resource from 'resource';
import { HOST } from 'micro';
import Box1 from './subPage/box1';
import List from './subPage/list';
import Hot7 from 'static/images/hot7.png';
import Hot30 from 'static/images/hot30.png';
import LYLZ from 'static/images/lylz.png';
import HD from 'static/images/hd.png';

const Images = {
    h7: Hot7,
    h30: Hot30,
    lylz: LYLZ
};
class Hot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hotList: [],
            author: [],
            userId: sessionStorage.getItem('token') || '',
            type: this.props.match.params.type
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
        if (!item.attention) {
            return false;
        }
        if (!item.attention.follower) {
            return false;
        }
        return item.attention.follower.indexOf(userId) !== -1;
    };

    render() {
        const { author, type, userId } = this.state;
        return (
            <div className={style.container}>
                <div className={style.left}>
                    <img className={style.img} src={Images[type]} alt="" />
                    <List type={type} />
                </div>
                <div className={style.right}>
                    <Box1 title="推荐作者">
                        {author.map(item => {
                            return (
                                <div
                                    key={item.userId}
                                    className={style.flexRow}
                                >
                                    <div className={style.flexEnd}>
                                        <img
                                            src={HOST + item.headurl}
                                            onError={this.setDefault}
                                            alt=""
                                        />
                                        <div className={style.inner}>
                                            <p className={style.title}>
                                                {item.username}
                                            </p>
                                            <p>
                                                发表文章： {item.articleCount}，评论：{' '}
                                                {item.commentCount}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={style.attention}
                                        title={
                                            this.isAttentioned(item, userId)
                                                ? '取消关注'
                                                : '+关注'
                                        }
                                        style={{
                                            color: this.isAttentioned(
                                                item,
                                                userId
                                            )
                                                ? '#ccc'
                                                : '#42c02e'
                                        }}
                                        onClick={() => this.handleCare(item)}
                                    >
                                        {this.isAttentioned(item, userId)
                                            ? '已关注'
                                            : '+关注'}
                                    </span>
                                </div>
                            );
                        })}
                    </Box1>
                </div>
            </div>
        );
    }
}

export default Hot;
