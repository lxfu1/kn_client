import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import style from './style.scss'
import dong from './images/guangdong.png'
import xin from './images/xinyong.jpg'
import Feedback from './images/feedback.png'
import Top from './images/top.png'
class Right extends React.Component {
    constructor(props) {
        super(props)
        this.time = null
        this.status = false
        this.state = {
            show: false,
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.EventScroll)
    }

    componentWillMount() {
        let top = document.documentElement.scrollTop || document.body.scrollTop
        if (top > 200) {
            this.setState({
                show: true
            })
            this.status = false
        }
    }

    EventScroll = () => {
        let show,
            top = document.documentElement.scrollTop || document.body.scrollTop
        if (top > 200) {
            show = true
        } else {
            show = false
        }

        if (show === this.state.show || this.status) {
            return
        }

        this.status = true

        this.setState(
            {
                show: show
            },
            () => {
                this.status = false
            }
        )
    }

    scrollTop = () => {
        if (window.requestAnimationFrame) {
            let me = this
            me.time = requestAnimationFrame(function fn() {
                let Top = document.body.scrollTop || document.documentElement.scrollTop
                if (Top > 0) {
                    scrollTo(0, Top - 100)
                    me.time = requestAnimationFrame(fn)
                } else {
                    cancelAnimationFrame(me.time)
                }
            })
        } else {
            scrollTo(0, 0)
        }
    }

    render() {
        return (
            <div className={style.rightScroll}>
                <div
                    className={style.common}
                    style={{ display: this.state.show ? 'flex' : 'none' }}
                    onClick={this.scrollTop}
                >
                    <span className={style.arrow}></span>
                </div>
            </div>
        )
    }
}

export default Right
