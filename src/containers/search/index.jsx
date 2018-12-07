import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { message } from 'antd';
import moment from 'moment';
import style from './style.scss';
import resource from 'resource';
import Lists from './subPage/list';

const MENU = [
    {
        icon: '&#xe643;',
        text: '文章'
    },
    {
        icon: '&#xe600;',
        text: '用户',
        forbiden: true
    },
    {
        icon: '&#xe67d;',
        text: '专题',
        forbiden: true
    },
    {
        icon: '&#xe650;',
        text: '专辑',
        forbiden: true
    }
];
class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hotSearch: [],
            searchHistory: this.getHistory(),
            searchResult: [],
            page: 1,
            size: 10,
            total: 0,
            keyword: this.props.match.params.keyword,
            type: this.props.match.params.type || '文章'
        };
    }

    componentDidMount() {
        this.getHots();
    }

    changeHistory = () => {
        let { page, size, total } = this.state;
        if (page * size >= total) {
            message.warning('没有更多数据了', 1);
            return;
        }
        page += 1;
        this.setState(
            {
                page
            },
            () => {
                this.getHots();
            }
        );
    };

    getHistory = () => {
        let res = [];
        let history = localStorage.getItem('search');
        if (history) {
            res = JSON.parse(history);
        }
        return res;
    };

    resetOption = word => {
        let { keyword } = this.state;
        if (word === keyword) {
            return;
        }
        keyword = word;
        this.setState({
            keyword
        });
    };

    getHots = () => {
        let { page, size } = this.state;
        resource
            .get(`/kn/searchHistory?page=${page}&size=${size}`)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        hotSearch: res.data.rows,
                        total: res.data.count
                    });
                } else {
                    message.warning(res.message);
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    clearHistory = (e, item) => {
        e.stopPropagation();
        let history = [];
        if (!item) {
            localStorage.setItem('search', '');
        } else {
            history = JSON.parse(localStorage.getItem('search') || '[]');
            let exist = history.findIndex(inner => inner === item);
            history.splice(exist, 1);
            localStorage.setItem('search', JSON.stringify(history));
        }
        this.setState({
            searchHistory: history
        });
    };

    render() {
        const { hotSearch, searchHistory, keyword, type } = this.state;
        return (
            <div className={style.container}>
                <div className={style.left}>
                    <div className={style.menu}>
                        <ul>
                            {MENU.map(item => {
                                return (
                                    <li
                                        key={item.text}
                                        style={{
                                            cursor: item.forbiden
                                                ? 'not-allowed'
                                                : 'pointer'
                                        }}
                                        className={
                                            item.text === type
                                                ? style.active
                                                : ''
                                        }
                                    >
                                        <span className={style.icons}>
                                            <i
                                                className="icon iconfont"
                                                dangerouslySetInnerHTML={{
                                                    __html: item.icon
                                                }}
                                            />
                                        </span>
                                        <span>{item.text}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className={style.common}>
                        <div className={style.header}>
                            <span>热门搜索</span>
                            <span
                                className={style.control}
                                onClick={this.changeHistory}
                            >
                                换一批
                            </span>
                        </div>
                        <div className={style.flexRow}>
                            {hotSearch.map(item => {
                                return (
                                    <Link
                                        key={item.keyword}
                                        to={
                                            item.type === '文章'
                                                ? `/main/search/${
                                                      item.keyword
                                                  }/文章`
                                                : `/main/search/文章/${
                                                      item.type
                                                  }`
                                        }
                                        target="_blank"
                                    >
                                        {item.keyword}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                    <div
                        className={style.common}
                        style={{
                            display: searchHistory.length > 0 ? 'block' : 'none'
                        }}
                    >
                        <div className={style.header}>
                            <span>历史搜索</span>
                            <span
                                className={style.control}
                                onClick={e => {
                                    this.clearHistory(e);
                                }}
                            >
                                清空
                            </span>
                        </div>
                        <div className={style.flexColumn}>
                            {searchHistory.map(item => {
                                return (
                                    <div
                                        key={item}
                                        onClick={() => {
                                            this.resetOption(item);
                                        }}
                                    >
                                        <span>
                                            <i className="icon iconfont">
                                                &#xe632;
                                            </i>
                                            {item}
                                        </span>
                                        <i
                                            onClick={e => {
                                                this.clearHistory(e, item);
                                            }}
                                        >
                                            x
                                        </i>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className={style.right}>
                    <Lists keyword={keyword} type={type} />
                </div>
            </div>
        );
    }
}

export default Search;
