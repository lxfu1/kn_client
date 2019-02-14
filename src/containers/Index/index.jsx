import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { message } from 'antd';
import Recommend from 'components/recommend';
import style from './style.scss';
import resource from 'resource';
import Wheel from './subPage/Wheel';
import List from './subPage/list';
import Box from './subPage/box';
import Box1 from './subPage/box1';
import WX from './images/wx.jpg';
import HOT7 from './images/hot7.png';
import HOT30 from './images/hot30.png';

class HomeIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            labels: []
        };
    }

    componentDidMount() {
        this.getLabels();
    }

    getLabels = () => {
        resource
            .get('/kn/articleTypes?limit=20')
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        labels: res.data
                    });
                } else {
                    message.warning(res.message);
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    render() {
        const { labels } = this.state;
        const boxStyle = {
            border: '1px solid #f0f0f0',
            borderRadius: '3px'
        };
        return (
            <div className={style.container}>
                <div className={style.left}>
                    <Wheel />
                    <Box boxStyle={{ marginTop: '20px' }}>
                        <strong
                            className={style.boxStrong}
                            style={{ background: 'rgb(255, 94, 82)' }}
                        >
                            博主置顶
                        </strong>
                        <h3 className={style.boxTitle}>博主介绍</h3>
                        <p style={{ textIndent: '2em' }}>
                            系统功能持续完善中，精力有限，想做的太多时间太少，代码难写，切勿破坏！
                            如果你对node.js、react、react-native、koa.js、canvas等有兴趣，
                            欢迎加博主微信，我们一起打造后续功能。
                        </p>
                    </Box>
                    <List />
                </div>
                <div className={style.right}>
                    <div className={style.hotList}>
                        <ul>
                            <li>
                                <Link to="/main/hot/h7">
                                    <img src={HOT7} alt="" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/main/hot/h30">
                                    <img src={HOT30} alt="" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <Box1 title="热门标签">
                        <div className={style.flexRow}>
                            {labels.length ? (
                                labels.map(item => {
                                    return (
                                        <Link
                                            className={style.labels}
                                            to={`/main/search/${item.text}/${
                                                item.labelId
                                            }`}
                                            target="_blank"
                                            key={item.labelId}
                                        >
                                            {item.text}
                                        </Link>
                                    );
                                })
                            ) : (
                                <p>加载中...........</p>
                            )}
                        </div>
                    </Box1>
                    <Recommend />
                    <Box1 title="和作者一起完善？" boxStyle={boxStyle}>
                        <img className={style.wx} src={WX} alt="" />
                    </Box1>
                </div>
            </div>
        );
    }
}

export default HomeIndex;
