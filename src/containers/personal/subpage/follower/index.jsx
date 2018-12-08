import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import { Facebook } from 'react-content-loader';
import { HOST } from 'micro';
import Pagination from 'rc-pagination';
import resource from 'util/resource';
import HD from 'static/images/hd.png';
import style from './styles.scss';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            total: 0,
            page: 1,
            loading: true
        };
    }

    componentDidMount() {
        this.getList();
    }

    getList = () => {
        let { page } = this.state;
        resource
            .get(
                `/kn/attentionUser?page=${page}&size=10&type=follower&userId=${
                    this.props.userId
                }`
            )
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        list: res.data.rows,
                        total: res.data.count,
                        loading: false
                    });
                }
            })
            .catch(err => {
                message.error('程序出了点问题，客官请稍后访问');
                console.log(err);
            });
    };

    pageChange = page => {
        this.setState(
            {
                page: page
            },
            () => {
                this.getList();
            }
        );
    };

    setDefault = e => {
        e.target.setAttribute('src', HD);
    };

    render() {
        let { list, loading } = this.state;
        return (
            <div className={style.container}>
                <div className={style.flexColumn}>
                    {loading ? (
                        <Facebook />
                    ) : list.length ? (
                        list.map(item => {
                            return (
                                <div
                                    key={item.userId}
                                    className={style.flexRow}
                                >
                                    <div className={style.flexEnd}>
                                        <img
                                            src={item.headUrl || HD}
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
                                </div>
                            );
                        })
                    ) : (
                        <p>暂无数据</p>
                    )}
                </div>
                <div
                    className={style.pagination}
                    style={{ display: this.state.total > 10 ? 'flex' : 'none' }}
                >
                    <Pagination
                        current={this.state.page}
                        total={this.state.total}
                        pageSize={10}
                        onChange={this.pageChange}
                    />
                </div>
            </div>
        );
    }
}

export default List;
