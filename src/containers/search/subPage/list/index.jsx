import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {message} from 'antd'
import moment from 'moment'
import Pagination from 'rc-pagination'
import resource from 'util/resource'
import styles from './styles.scss'

class List extends Component {
    constructor(props){
        super(props);
        this.state = {
            articleList: [],
            total: 0,
            page: 1,
            keyword: this.props.keyword,
            type: this.props.type
        }
    }

    componentDidMount(){
        this.getList();
    }

    getList = () => {
        console.log(66);
        let {keyword, page, type} = this.state;
        resource.get(`/kn/search?page=${page}&size=10&keyword=${keyword}&type=${type}`).then(res => {
            if(res.status === 200){
                this.setState({
                    articleList: res.data.rows,
                    total: res.data.count
                })
            }
        }).catch(err => {
            message.error('程序出了点问题，客官请稍后访问');
            console.log(err);
        })
    }

    pageChange = (page) => {
       this.setState({
           page: page
       }, () => {
           this.getList();
       })
    }

    render() {
        let {articleList} = this.state;
        return (
            <div className={styles.container}>
                {
                    articleList.map(item => {
                        return <div className={styles.common} key={item.articleId}>
                            <Link to={`/main/detail/${item.articleId}`} target="_blank">
                               <h5>{item.title}</h5>
                            </Link>
                            <div className={styles.items}>
                                <p className={styles.content}>{item.introduction}</p>
                                <div className={styles.icons}>
                                         <span>
                                             <i className="icon iconfont">&#xe722;</i>
                                            <a href="">{item.scans || 0}</a>
                                         </span>
                                         <span>
                                            <i className="icon iconfont">&#xe603;</i>
                                            <a href="">{item.comments || 0}</a>
                                        </span>
                                         <span>
                                             <i className="icon iconfont">&#xe632;</i>
                                            <a href="">{moment(item.updateTime).format('YYYY-MM-DD hh:mm:ss')}</a>
                                        </span>
                                </div>
                            </div>
                        </div>
                    })
                }
                <div className={styles.pagination} style={{display: this.state.total > 10 ? 'flex': 'none'}}>
                    <Pagination
                        current={this.state.page}
                        total={this.state.total}
                        pageSize={10}
                        onChange={this.pageChange}
                    />
                </div>
            </div>
        )
    }
}

export default List
