import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { message, Modal } from 'antd';
import { Facebook } from 'react-content-loader';
import moment from 'moment';
import { HOST } from 'micro';
import ListIcons from 'components/icons';
import Pagination from 'rc-pagination';
import resource from 'util/resource';
import style from './styles.scss';

const confirm = Modal.confirm;
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
                `/kn/searchByPersonal?page=${page}&size=10&userId=${
                    this.props.userId
                }`
            )
            .then(res => {
                if (res.status === 200) {
                    this.setState(
                        {
                            list: res.data.rows,
                            total: res.data.count,
                            loading: false
                        },
                        () => {
                            this.props.callback(res.data.count);
                        }
                    );
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

    /**
     * 文章删除
     * */
    delete = articleId => {
        let _this = this;
        confirm({
            title: '确认删除此文章?',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                resource
                    .delete(`/kn/deleteArticleAdmin/${articleId}`)
                    .then(res => {
                        if (res.status === 200) {
                            message.success('删除成功');
                            _this.getList();
                        } else {
                            throw new Error('删除失败');
                        }
                    })
                    .catch(err => message.error(err));
            },
            onCancel() {}
        });
    };

    render() {
        let { list, loading } = this.state;
        return (
            <div className={style.container}>
                <div className={style.flexColumn}>
                    {loading ? (
                        <Facebook />
                    ) : (
                        list.map(item => {
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
                                        <ListIcons
                                            item={item}
                                            delete={this.delete}
                                            needDelete={true}
                                        />
                                    </div>
                                    <div className={style.contentRight}>
                                        <img
                                            src={`${HOST}${item.fileUrl}`}
                                            alt=""
                                        />
                                    </div>
                                </div>
                            );
                        })
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
