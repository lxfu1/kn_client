import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import { Facebook } from 'react-content-loader';
import { HOST } from 'micro';
import ListIcons from 'components/icons';
import Pagination from 'rc-pagination';
import resource from 'util/resource';
import style from './styles.scss';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hotList: [],
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
        let type = this.props.type === 'h7' ? 7 : 30;
        resource
            .get(`/kn/searchByTime?page=${page}&size=10&type=${type}`)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        hotList: res.data.rows,
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

    render() {
        let { hotList, loading } = this.state;
        return (
            <div className={style.container}>
                <div className={style.flexColumn}>
                    {loading ? (
                        <Facebook />
                    ) : hotList.length ? (
                        hotList.map(item => {
                            return (
                                <div
                                    className={style.common}
                                    key={item.articleId}
                                >
                                    <div
                                        className={style.contentleft}
                                        style={{
                                            width: item.fileUrl ? '75%' : '100%'
                                        }}
                                    >
                                        <Link
                                            to={`/main/detail/${
                                                item.articleId
                                            }`}
                                            target="_blank"
                                        >
                                            <h4 className={style.newList}>
                                                {item.title}
                                            </h4>
                                        </Link>
                                        <p className={style.content}>
                                            {item.introduction}
                                        </p>
                                        <ListIcons item={item} />
                                    </div>
                                    <div
                                        className={style.contentRight}
                                        style={{
                                            display: item.fileUrl
                                                ? 'flex'
                                                : 'none'
                                        }}
                                    >
                                        <img
                                            src={`${HOST}${item.fileUrl}`}
                                            alt=""
                                        />
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className={style.empty}>
                            博主最近太忙、来不及发布文章。
                        </p>
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
