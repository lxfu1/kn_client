import React, { Component } from 'react'
import moment from 'moment'
import { NavLink } from 'react-router-dom'
import style from './style.scss'

class Box extends Component {

    render() {
        return (
            <div className={style.box} style={{...this.props.boxStyle}}>
                {
                    this.props.children
                }
            </div>
        )
    }
}

export default Box
