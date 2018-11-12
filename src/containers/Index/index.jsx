import React, { Component } from 'react'
import { NavLink, Link} from 'react-router-dom'
import {message} from 'antd'
import moment from 'moment'
import style from './style.scss'
import resource from 'resource'
import {HOST} from 'micro'
import Wheel from './subPage/Wheel'
import Box from './subPage/box'
import Box1 from './subPage/box1'
import WX from './images/wx.jpg'
import HOT7 from './images/hot7.png'
import HOT30 from './images/hot30.png'
import LYLZ from './images/lylz.png'

class HomeIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newList: [],
            labels: []
        }
    }

    componentDidMount() {
        this.getLabels();
        this.getList();
    }

    getList = () => {
        resource.get(`/kn/articleList?page=1&size=7`).then(res => {
            if (res.status === 200) {
                this.setState({
                    newList: res.data.rows
                })
            }
        }).catch(err => {
            console.log(err);
            message.error('程序出了点问题，客官请稍后访问');
        })
    }

    getLabels = () => {
        resource.get('/kn/articleTypes').then(res => {
            if (res.status === 200) {
                this.setState({
                    labels: res.data
                })
            } else {
                message.warning(res.message);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    render() {
        const {newList, labels, likeTops}= this.state;
        return (
            <div className={style.container}>
                <div className={style.left}>
                    <Wheel />
                    <Box boxStyle={{marginTop: '20px'}}>
                        <strong className={style.boxStrong}
                                style={{background: 'rgb(255, 94, 82)'}}>博主置顶</strong>
                        <h3 className={style.boxTitle}>博主介绍</h3>
                        <p style={{textIndent:'2em'}}>准备吃晚饭了，好丰盛啊！红烧牛肉，海鲜，大虾，泡椒凤爪，葱香排骨，黑胡椒牛排.....这么多口味的方便面，该吃哪一种呢？ 每当考试时候，老师说：“请把和考试无关的东西放在讲台上。”我真的很想把自己放在讲台上。。。</p>
                    </Box>
                    <Box1 title="最新发布">
                        <div className={style.flexColumn}>
                            {
                                newList.map(item => {
                                    return <div className={style.common} key={item.articleId}>
                                        <div className={style.contentleft}
                                             style={{width: item.fileUrl ? '75%' : '100%'}}>
                                            <Link to={`/main/detail/${item.articleId}`} target="_blank">
                                                <h4 className={style.newList}>{item.title}</h4>
                                            </Link>
                                            <p className={style.content}>{item.introduction}</p>
                                            <div className={style.icons}>
                                                <span>
                                                    <i className="icon iconfont">&#xe688;</i>
                                                    <a href="">{item.author || '-'}</a>
                                                </span>
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
                                        <div className={style.contentRight}>
                                            <img src={`${HOST}${item.fileUrl}`} alt=""/>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </Box1>
                </div>
                <div className={style.right}>
                    <div className={style.hotList}>
                        <ul>
                            <li>
                                <img src={HOT7} alt=""/>
                            </li>
                            <li>
                                <img src={HOT30} alt=""/>
                            </li>
                            <li>
                                <img src={LYLZ} alt=""/>
                            </li>
                        </ul>
                    </div>
                    <Box1 title="热门标签">
                        <div className={style.flexRow}>
                            {
                                labels.map(item => {
                                    return <Link
                                        className={style.labels}
                                        to={`/main/search/${item.text}/文章`}
                                        target="_blank"
                                        key={item.id}>{item.text}</Link>
                                })
                            }
                        </div>
                    </Box1>
                    <Box1 title="关注微信公众号">
                        <img className={style.wx} src={WX} alt=""/>
                    </Box1>
                </div>
            </div>
        )
    }
}

export default HomeIndex
