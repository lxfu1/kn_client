import React, { Component } from 'react';
import Recommend from 'components/recommend';
import style from './style.scss';
import List from './subPage/list';
import Hot7 from 'static/images/hot7.png';
import Hot30 from 'static/images/hot30.png';
import LYLZ from 'static/images/lylz.png';

const Images = {
    h7: Hot7,
    h30: Hot30,
    lylz: LYLZ
};
class Hot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.match.params.type
        };
    }

    render() {
        const { type } = this.state;
        return (
            <div className={style.container}>
                <div className={style.left}>
                    <img className={style.img} src={Images[type]} alt="" />
                    <List type={type} />
                </div>
                <div className={style.right}>
                    <Recommend />
                </div>
            </div>
        );
    }
}

export default Hot;
