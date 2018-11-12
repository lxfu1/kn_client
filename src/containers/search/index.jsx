import React, { Component } from 'react'
import { NavLink, Link} from 'react-router-dom'
import {message} from 'antd'
import moment from 'moment'
import style from './style.scss'
import resource from 'resource'
import List from './subPage/list'

const MENU = [
    {
        icon: '&#xe643;',
        text: '文章'
    },
    {
        icon: '&#xe600;',
        text: '用户'
    },
    {
        icon: '&#xe67d;',
        text: '专题'
    },
    {
        icon: '&#xe650;',
        text: '专辑'
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
            type: this.props.match.params.type || '文章',
        }
    }

    componentDidMount() {
        this.getHots();
    }

    changeHistory = () => {
        let {page, size, total} = this.state;
        if(page * size >= total){
            message.warning('没有更多数据了', 1);
            return;
        }
        page += 1;
        this.setState({
            page
        }, ()=>{
            this.getHots();
        })
    }

    getHistory = () => {
        let res = [];
        let history = localStorage.getItem('search');
        if(history){
            res = JSON.parse(history);
        }
        return res;
    }

    getHots = () => {
        let {page, size} = this.state;
        resource.get(`/kn/searchHistory?page=${page}&size=${size}`).then(res => {
            if (res.status === 200) {
                this.setState({
                    hotSearch: res.data.rows,
                    total: res.data.count
                })
            } else {
                message.warning(res.message);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    clearHistory = (item) => {
        let history = [];
        if(!item){
            localStorage.setItem('search', '');
        }else{
            history = JSON.parse(localStorage.getItem('search') || '[]');
            let exist = history.findIndex(inner => inner === item);
            history.splice(exist, 1);
            localStorage.setItem('search', JSON.stringify(history));
        }
        this.setState({
            searchHistory: history
        });
    }

    render() {
        const {
            hotSearch,
            searchHistory,
            keyword,
            type
            }= this.state;
        return (
            <div className={style.container}>
                <div className={style.left}>
                    <div className={style.menu}>
                        <ul>
                            {
                                MENU.map(item => {
                                    return <li key={item.text}
                                               className={item.text === type ? style.active : ''}>
                                        <span className={style.icons}>
                                             <i className="icon iconfont" dangerouslySetInnerHTML={{__html: item.icon}}></i>
                                        </span>
                                        <span>{item.text}</span>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                    <div className={style.common}>
                        <div className={style.header}>
                            <span>热门搜索</span>
                            <span className={style.control} onClick={this.changeHistory}>换一批</span>
                        </div>
                        <div className={style.flexRow}>
                            {
                                hotSearch.map(item => {
                                    return <Link key={item.keyword} to={`/main/search/${item.keyword}/${item.type}`}>
                                        {item.keyword}
                                    </Link>
                                })
                            }
                        </div>
                    </div>
                    <div className={style.common}
                         style={{display: searchHistory.length > 0 ? 'block' : 'none'}}>
                        <div className={style.header}>
                            <span>历史搜索</span>
                            <span className={style.control}
                                  onClick={()=>{this.clearHistory('')}}>清空</span>
                        </div>
                        <div className={style.flexColumn}>
                            {
                                searchHistory.map(item => {
                                    return <Link key={item} to={`/main/search/${item}/${type}`}>
                                        <span><i className="icon iconfont">&#xe632;</i>{item}</span>
                                        <i onClick={()=>{this.clearHistory(item)}}>x</i>
                                    </Link>
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className={style.right}>
                    <List keyword={keyword} type={type} />
                </div>
            </div>
        )
    }
}

export default Search
