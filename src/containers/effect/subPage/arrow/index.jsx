import React, { Component } from 'react';
import styles from './style.scss';

class Line {
    constructor(ctx, { x1, y1, x2, y2 }) {
        this.ctx = ctx;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.strokeStyle = '#ff0';
        this.theta = Math.PI / 6;
        this.arrowHorization = 20;
        this.offset = 1;
        this.draw();
        this.drawArrow();
    }

    draw() {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.strokeStyle = this.strokeStyle;
        ctx.stroke();
        ctx.closePath();
    }

    drawArrow() {
        const ctx = this.ctx;
        const { x1, y1, x2, y2 } = this.getArrowPoint(
            this.x1,
            this.y1,
            this.x2,
            this.y2,
            this.theta,
            this.arrowHorization
        );
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.strokeStyle;
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    /**
     * 弱智方法， 后续改进
     * @param {*} ox1
     * @param {*} oy1
     * @param {*} ox2
     * @param {*} oy2
     * @param {*} theta
     * @param {*} distance
     */
    getArrowPoint(ox1, oy1, ox2, oy2, theta, distance) {
        const ratio = Math.atan(Math.abs(ox1 - ox2) / Math.abs(oy1 - oy2));
        let x1, y1, x2, y2;

        // 第一、四象限
        if (ox1 <= ox2) {
            if (oy2 < oy1) {
                x1 = ox2 - distance * Math.sin(ratio - theta);
                x2 = ox2 - distance * Math.cos(Math.PI / 2 - ratio - theta);
                y1 = oy2 + distance * Math.cos(ratio - theta);
                y2 = oy2 + distance * Math.sin(Math.PI / 2 - ratio - theta);
            } else {
                x1 = ox2 - distance * Math.sin(ratio - theta);
                x2 = ox2 - distance * Math.cos(Math.PI / 2 - ratio - theta);
                y1 = oy2 - distance * Math.cos(ratio - theta);
                y2 = oy2 - distance * Math.sin(Math.PI / 2 - ratio - theta);
            }
        }
        // 第二、三象限
        if (ox1 > ox2) {
            if (oy2 <= oy1) {
                x1 = ox2 + distance * Math.sin(ratio - theta);
                x2 = ox2 + distance * Math.cos(Math.PI / 2 - ratio - theta);
                y1 = oy2 + distance * Math.cos(ratio - theta);
                y2 = oy2 + distance * Math.sin(Math.PI / 2 - ratio - theta);
            } else {
                x1 = ox2 + distance * Math.sin(Math.PI / 2 - ratio - theta);
                x2 = ox2 + distance * Math.cos(ratio - theta);
                y1 = oy2 - distance * Math.cos(Math.PI / 2 - ratio - theta);
                y2 = oy2 - distance * Math.sin(ratio - theta);
            }
        }
        return { x1, y1, x2, y2 };
    }

    update({ x1, y1, x2, y2 }) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.draw();
    }
    destroy() {}
}

class Arrow extends Component {
    constructor() {
        super();
        this.w = window.screen.width > 1280 ? document.body.offsetWidth : 1280;
        this.h = document.body.clientHeight - 60;
        this.padding = 50;
        this.ctx = null;
    }

    componentDidMount() {
        this.init();
        this.draw(1);
    }

    init = () => {
        const canvas = document.querySelector('#canvas');
        canvas.width = this.w;
        canvas.height = this.h;
        this.ctx = canvas.getContext('2d');
    };

    random = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    draw = r => {
        this.reset();
        const Step = Math.PI / 4;
        for (let i = 0; i < 8; i++) {
            new Line(this.ctx, {
                x1: this.w / 2,
                y1: this.h / 2,
                x2: this.w / 2 + r * Math.cos(Step * i),
                y2: this.h / 2 + r * Math.sin(Step * i)
            });
        }
        if (r < 200) {
            r += 1;
            this.time = requestAnimationFrame(() => {
                this.draw(r);
            });
        } else {
            cancelAnimationFrame(this.time);
        }
    };

    transformLinePosition = data => {
        const x1 = data[0].x;
        const y1 = data[0].y;
        const x2 = data[1].x;
        const y2 = data[1].y;
        return { x1, y1, x2, y2 };
    };

    reset = () => {
        let ctx = this.ctx;
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba( 15, 5, 2, 1 )';
        ctx.fillRect(0, 0, this.w, this.h);
        ctx.globalCompositeOperation = 'lighter';
    };

    render() {
        return (
            <div className={styles.container}>
                <canvas id="canvas" />
            </div>
        );
    }
}

export default Arrow;
