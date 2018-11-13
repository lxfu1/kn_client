import React, { Component } from 'react'
import moment from 'moment'
import { NavLink } from 'react-router-dom'
import style from './style.scss'

class Box1 extends Component {

    render() {
        return (
            <div className={style.box} style={{...this.props.boxStyle}}>
                <h5>
                    {
                        this.props.title
                    }
                </h5>
                <div className={style.children}>
                    {
                        this.props.children
                    }
                </div>
            </div>
        )
    }
}

export default Box1
