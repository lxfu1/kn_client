import React, { Component } from 'react';
import { message } from 'antd';
import styles from './style.scss';
message.config({
    top: 100
});
const Radius = 10;
const Relations = [
    {
        name: '马云',
        x: 500,
        y: 200,
        id: 'curve1',
        target: 'curve2'
    },
    {
        name: '阿里巴巴',
        x: 520,
        y: 230,
        id: 'curve2'
    }
];

class Circle {
    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.radius = Radius;
        this.fillStyle = '#ff0';
        this.draw();
    }

    draw() {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.fillStyle;
        ctx.fill();
        ctx.closePath();
    }
    update(x, y) {
        this.x = x;
        this.y = y;
        this.draw();
    }
    destroy() {}
}

class Line {
    constructor(ctx, { x1, y1, x2, y2 }) {
        this.ctx = ctx;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.strokeStyle = '#ff0';
        this.draw();
    }

    draw() {
        const ctx = this.ctx;
        const { x1, y1, x2, y2 } = this.offsetCircle(this.x1, this.y1, this.x2, this.y2);
        const { cX1, cy1, cx2, cy2 } = this.beizerPoints(x1, y1, x2, y2);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        // ctx.lineTo(this.x2, this.y2);
        ctx.bezierCurveTo(cX1, cy1, cx2, cy2, x2, y2);
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }

    offsetCircle(ox1, oy1, ox2, oy2) {
        const reduce = oy2 - oy1;
        // const degree = Math.atan((ox1 - ox2) / (oy2 - oy1));
        let x1 = ox1;
        let y1 = reduce > 0 ? oy1 + Radius : oy1 - Radius;
        let x2 = ox2;
        let y2 = reduce > 0 ? oy2 - Radius : oy2 + Radius;
        return { x1, y1, x2, y2 };
    }

    /**
     * 通过起始点、终点 => 控制点（需要做特殊处理， 目前没做）
     * @param {*} x1
     * @param {*} y1
     * @param {*} x2
     * @param {*} y2
     */
    beizerPoints(x1, y1, x2, y2) {
        const seriseX = 0.1;
        const seriseY = 0.5;
        const reduceY = y2 - y1;
        const reduceX = x2 - x1;
        const offsetX = Math.min(Math.abs(reduceX) * seriseX, 20);
        const offsetY = Math.max(Math.abs(reduceY) * seriseY, 20);
        const cX1 = reduceX > 0 ? x1 + offsetX : x1 - offsetX;
        const cx2 = reduceX > 0 ? x2 - offsetX : x2 + offsetX;
        const cy1 = reduceY > 0 ? y1 + offsetY : y1 - offsetY;
        const cy2 = reduceY > 0 ? y2 - offsetY : y2 + offsetY;
        return { cX1, cy1, cx2, cy2 };
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

class Curve extends Component {
    constructor() {
        super();
        this.drag = false;
        this.dragEle = null;
        this.particles = {};
        this.w = window.screen.width > 1280 ? document.body.offsetWidth : 1280;
        this.h = document.body.clientHeight - 60;
        this.padding = 50;
        this.ctx = null;
        this.animate = true;
    }

    componentDidMount() {
        this.init();
        this.draw(true);
    }

    init = () => {
        const canvas = document.querySelector('#canvas');
        canvas.width = this.w;
        canvas.height = this.h;
        this.ctx = canvas.getContext('2d');
        canvas.addEventListener('mousemove', this.move);
        canvas.addEventListener('mousedown', this.mousedown);
        canvas.addEventListener('mouseup', this.mouseup);
    };

    move = e => {
        if (this.animate) {
            return;
        }
        let exist = this.isExist(e.pageX, e.pageY - 60);
        if (exist) {
            document.body.style.cursor = 'move';
            if (this.drag) {
                this.dragEle = exist;
                let choose = Relations.find(item => item.id === exist);
                choose.x = e.pageX;
                choose.y = e.pageY - 60;
                this.draw();
            }
        } else {
            document.body.style.cursor = 'default';
        }
    };

    mousedown = e => {
        if (this.animate) {
            return;
        }
        this.drag = true;
    };

    mouseup = e => {
        if (this.animate) {
            return;
        }
        this.drag = false;
        this.dragEle = null;
    };

    isExist = (x, y) => {
        if (this.dragEle) {
            return this.dragEle;
        }
        let exist;
        for (let i = 0; i < Relations.length; i++) {
            if (x < Relations[i].x - Radius || x > Relations[i].x + Radius) {
                continue;
            }
            if (y < Relations[i].y - Radius || y > Relations[i].y + Radius) {
                continue;
            }
            let distance = Math.sqrt(Math.pow(Relations[i].x - x, 2) + Math.pow(Relations[i].y - y, 2));
            if (distance <= Radius) {
                exist = Relations[i].id;
                break;
            }
        }
        return exist;
    };

    random = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    draw = flag => {
        this.reset();
        Relations.map(item => {
            this.particles[item.id] = new Circle(this.ctx, item.x, item.y);
        });
        this.line = new Line(this.ctx, this.transformLinePosition(Relations));
        if (flag) {
            if (Relations[1].y < 500 && Relations[1].x < 900) {
                Relations[1].x += 2;
                Relations[1].y += 1.5;
                this.timer = requestAnimationFrame(() => {
                    this.draw(flag);
                });
            } else {
                cancelAnimationFrame(this.timer);
                this.animate = false;
                message.success('可以拖动了');
            }
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

    componentWillUnmount() {
        if (this.timer) {
            cancelAnimationFrame(this.timer);
        }
    }

    render() {
        return (
            <div className={styles.container}>
                <canvas id="canvas" />
            </div>
        );
    }
}

export default Curve;
