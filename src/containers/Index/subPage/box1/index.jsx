import React, { Component } from 'react';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import style from './style.scss';

class Box1 extends Component {
    render() {
        return (
            <div className={style.box} style={{ ...this.props.boxStyle }}>
                <h5
                    style={{ background: this.props.boxStyle ? '#f7f7f7' : '' }}
                >
                    {this.props.title}
                </h5>
                {this.props.children}
            </div>
        );
    }
}

export default Box1;
