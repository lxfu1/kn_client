import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Code } from 'react-content-loader';
import { message } from 'antd';
import { HOST } from 'micro';
import ListIcons from 'components/icons';
import resource from 'util/resource';
import style from './styles.scss';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articleList: [],
            total: 0,
            page: 1,
            size: 10,
            loading: true,
            moreLoading: false
        };
    }

    componentDidMount() {
        this.getList();
    }

    getList = () => {
        resource
            .get(
                `/kn/articleList?page=${this.state.page}&size=${
                    this.state.size
                }`
            )
            .then(res => {
                if (res.status === 200) {
                    let { articleList } = this.state;
                    articleList = articleList.concat(res.data.rows);
                    this.setState(
                        {
                            articleList,
                            total: res.data.count,
                            loading: false,
                            moreLoading: false
                        },
                        () => {
                            console.log(this.state.articleList);
                        }
                    );
                } else {
                    message.error(res.message);
                }
            })
            .catch(err => {
                message.error('程序出了点问题，客官请稍后访问');
                console.log(err);
            });
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
                this.getList();
            }
        );
    };

    render() {
        let {
            articleList,
            loading,
            moreLoading,
            total,
            page,
            size
        } = this.state;
        return (
            <div className={style.container}>
                {loading ? (
                    <Facebook />
                ) : (
                    articleList.map(item => {
                        return (
                            <div className={style.common} key={item.articleId}>
                                <div
                                    className={style.contentleft}
                                    style={{
                                        width: item.fileUrl ? '75%' : '100%'
                                    }}
                                >
                                    <Link
                                        to={`/main/detail/${item.articleId}`}
                                        target="_blank"
                                    >
                                        <h4 className={style.title}>
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
                                        display: item.fileUrl ? 'flex' : 'none'
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
                )}
                {moreLoading ? <Code /> : null}
                {total > page * size ? (
                    <span className={style.load_more} onClick={this.pageChange}>
                        阅读更多
                    </span>
                ) : null}
            </div>
        );
    }
}

export default List;
