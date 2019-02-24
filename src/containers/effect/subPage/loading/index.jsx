import React, { Component } from 'react';
import style from './style.scss';

class Particle {
    constructor(ctx, angle) {
        this.ctx = ctx;
        this.radius = 120;
        this.color = `rgb(${this.random(0, 255)},${this.random(
            0,
            255
        )},${this.random(0, 255)})`;
        this.alpha = 1;
        this.size = 1;
        this.alive = true;
        this.x = 200 + Math.cos(angle) * this.radius + this.random(1, 10);
        this.y = 200 + Math.sin(angle) * this.radius + this.random(1, 10);
    }
    random(min, max) {
        return Math.random() * (max - min) + min;
    }
    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.globalAlpha = this.alpha;
        this.ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    update() {
        this.alpha -= 0.02;
        if (this.alpha < 0) {
            this.alive = false;
            this.alpha = 0;
        }
    }
}

class Loading extends Component {
    constructor() {
        super();
        this.particles = [];
        this.w = 400;
        this.h = 400;
        this.ctx = null;
        this.animate = null;
    }

    componentDidMount() {
        this.init();
        this.draw(0);
    }

    init = () => {
        const canvas = document.querySelector('#canvasLoading');
        canvas.width = this.w;
        canvas.height = this.h;
        this.ctx = canvas.getContext('2d');
    };

    reset = () => {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.globalCompositeOperation = 'lighter';
    };

    draw = angle => {
        if (angle < Math.PI * 2) {
            angle += 0.05;
        } else {
            angle = 0;
        }
        this.reset();
        for (let i = 0; i < 30; i++) {
            this.particles.push(new Particle(this.ctx, angle));
        }
        this.update();
        this.animate = requestAnimationFrame(() => {
            this.draw(angle);
        });
    };

    update = () => {
        const particles = [...this.particles];
        particles.map((c, i) => {
            c.update();
            c.draw();
            if (!c.alive) {
                this.particles.splice(i, 1);
            }
        });
    };

    componentWillUnmount() {
        if (this.animate) {
            cancelAnimationFrame(this.animate);
        }
    }
    render() {
        return (
            <div className={style.container}>
                <canvas id="canvasLoading">
                    Canvas is not supported in your browser.
                </canvas>
            </div>
        );
    }
}

export default Loading;
