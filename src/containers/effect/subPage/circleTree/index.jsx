import React, { Component } from 'react';
import styles from './style.scss';
import kCharts from '../../kCharts';
import { tree } from './layout';
import D from './data.json';

class CircleTree extends Component {
    constructor() {
        super();
        this.w = window.screen.width > 1280 ? document.body.offsetWidth : 1280;
        this.h = document.body.clientHeight - 60;
        this.padding = 50;
        this.ctx = null;
        this.verticalDistance = 20;
        this.horizationDistance = 300;
        this.r = 5;
    }

    componentDidMount() {
        this.ctx = new kCharts('canvas', {
            width: this.w,
            height: this.h
        });
        const data = tree(D, {
            l: 100,
            h: this.h,
            baseVertical: this.h / 2,
            vd: this.verticalDistance,
            hd: this.horizationDistance
        });
        console.log(data);
        this.draw(data);
    }

    random = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    draw = data => {
        if (!data) {
            return;
        }
        this.ctx.circle({ x: data.x, y: data.y, r: this.r });
        if (data.children) {
            let _data = data.children;
            for (let i = 0; i < _data.length; i++) {
                this.ctx.circle({ x: _data[i].x, y: _data[i].y, r: this.r });
                // +1 为指定偏移
                this.ctx.bezier({ x1: data.x + this.r, y1: data.y, x2: _data[i].x - this.r, y2: _data[i].y });
                if (_data[i].children && _data[i].children.length) {
                    this.draw(_data[i]);
                }
            }
        }
    };

    render() {
        return <div className={styles.container} id="canvas" />;
    }
}

export default CircleTree;
