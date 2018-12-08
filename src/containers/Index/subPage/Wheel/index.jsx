import React, { Component } from 'react';
import { Code } from 'react-content-loader';
import { NavLink } from 'react-router-dom';
import style from './style.scss';
import resource from 'resource';
import DF from '../../images/slide3.jpg';

const Wth = 845;
class Wheel extends Component {
    constructor(props) {
        super(props);
        this.time = null;
        this.state = {
            order: 0,
            sty: 0,
            data: [],
            loading: true
        };
    }

    componentDidMount() {
        this.requestHotList();
    }

    requestHotList = () => {
        resource.get(`/kn/articleTopFive`).then(res => {
            if (res.status === 200) {
                let splitData = res.data.rows ? res.data.rows.slice(0, 3) : [];
                this.setState(
                    {
                        data: splitData,
                        loading: false
                    },
                    () => {
                        this.setTime(this.state.data.length);
                    }
                );
            }
        });
    };

    setTime = length => {
        if (this.time || length < 2) {
            return;
        }

        this.time = setInterval(() => {
            this.LunBo(length);
        }, 5000);
    };

    clearTime = () => {
        if (this.time) {
            clearInterval(this.time);
        }
        this.time = null;
    };

    LunBo = length => {
        let currentIndex = this.state.order,
            _length = this.state.data.length;
        if (currentIndex < _length - 1) {
            currentIndex += 1;
        } else {
            currentIndex = 0;
        }
        let left = -currentIndex * Wth + 'px';
        this.setState({
            order: currentIndex,
            sty: left
        });
    };

    changeImg = (e, index) => {
        if (index === this.state.order) {
            return;
        }

        let left = -index * Wth + 'px';
        this.setState({
            order: index,
            sty: left
        });
    };

    setDefault = e => {
        e.target.setAttribute('src', DF);
    };

    // 清除
    componentWillUnmount() {
        if (this.time) {
            clearInterval(this.time);
        }
    }

    render() {
        const { data, loading } = this.state;
        let l = data.length || 1;
        return (
            <div
                className={style.wheelBox}
                onMouseEnter={this.clearTime}
                onMouseLeave={this.setTime}
            >
                <div className={style.left}>
                    {loading ? (
                        <Code />
                    ) : (
                        <ul
                            className={style.img}
                            style={{
                                left: this.state.sty,
                                width: l * Wth + 'px'
                            }}
                        >
                            {data.map((item, index) => {
                                return (
                                    <li
                                        key={item.articleId}
                                        onClick={e => {
                                            this.changeImg(e, index);
                                        }}
                                    >
                                        <NavLink
                                            to={`/main/detail/${
                                                item.articleId
                                            }`}
                                        >
                                            <img
                                                src={item.fileUrl || DF}
                                                onError={this.setDefault}
                                                alt=""
                                            />
                                        </NavLink>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    <ul className={style.circle}>
                        {data.map((item, index) => {
                            return (
                                <li
                                    key={index}
                                    className={
                                        this.state.order === index
                                            ? style.active
                                            : ''
                                    }
                                    onClick={e => {
                                        this.changeImg(e, index);
                                    }}
                                />
                            );
                        })}
                    </ul>
                </div>
                <div className={style.right} />
            </div>
        );
    }
}

export default Wheel;
