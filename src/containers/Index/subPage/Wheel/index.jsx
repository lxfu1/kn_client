import React, { Component } from 'react'
import moment from 'moment'
import { NavLink } from 'react-router-dom'
import style from './style.scss'

const Wth = 845;
class Wheel extends Component {
    constructor(props) {
        super(props)
        this.time = null
        this.state = {
            order: 0,
            sty: 0,
            data: [
                require("../../images/slide1.jpg"),
                require("../../images/slide2.jpg"),
                require("../../images/slide3.jpg"),
                require("../../images/slide4.jpg")
            ]
        }
    }

    componentDidMount(){
        this.setTime(this.state.data.length)
    }

    setTime = length => {
        if (this.time || length < 2) {
            return
        }

        this.time = setInterval(() => {
            this.LunBo(length)
        }, 5000)
    }

    clearTime = () => {
        if (this.time) {
            clearInterval(this.time)
        }
        this.time = null
    }

    LunBo = length => {
        let currentIndex = this.state.order,
            _length = this.state.data.length;
        if (currentIndex < _length - 1) {
            currentIndex += 1
        } else {
            currentIndex = 0
        }
        let left = -currentIndex * Wth + 'px'
        this.setState({
            order: currentIndex,
            sty: left
        })
    }

    changeImg = (e, index) => {
        if (index === this.state.order) {
            return
        }

        let left = -index * Wth + 'px'
        this.setState({
            order: index,
            sty: left
        })
    }

    // 清除
    componentWillUnmount() {
        if (this.time) {
            clearInterval(this.time)
        }
    }

    render() {
        let l = this.state.data.length || 1;
        return (
            <div
                className={style.wheelBox}
                onMouseEnter={this.clearTime}
                onMouseLeave={this.setTime}
            >
                <div className={style.left}>
                    <ul
                        className={style.img}
                        style={{ left: this.state.sty, width: l * Wth + 'px' }}>
                        {
                            this.state.data.map((item, index) => {
                                return (
                                    <li
                                        key={index}
                                        onClick={e => {this.changeImg(e, index)}}
                                    >
                                        <img src={item} alt=""/>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <ul className={style.circle}>
                        {this.state.data.map((item, index) => {
                            return (
                                <li
                                    key={index}
                                    className={this.state.order === index ? style.active : ''}
                                    onClick={e => {this.changeImg(e, index)}}
                                />
                            )
                        })}
                    </ul>
                </div>
                <div className={style.right}>

                </div>
            </div>
        )
    }
}

export default Wheel
