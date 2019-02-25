import React, { Component } from 'react';
import styles from './style.scss';

class Particle {
    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.w = this.random(50, 100);
        this.angle = Math.PI / 6;
        this.x = x;
        this.y = y;
        this.speed = this.random(1, 4);
    }

    draw() {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.lineWidth = 2;
        const linear = ctx.createLinearGradient(
            this.x,
            this.y,
            this.x + this.w * Math.cos(this.angle),
            this.y + this.w * Math.sin(this.angle)
        );
        linear.addColorStop(0, '#000');
        linear.addColorStop(0.7, '#333');
        linear.addColorStop(1, '#fff');
        ctx.strokeStyle = linear;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x + this.w * Math.cos(this.angle),
            this.y + this.w * Math.sin(this.angle)
        );
        ctx.stroke();
        ctx.closePath();
    }
    random(min, max) {
        return Math.random() * (max - min) + min;
    }
    update() {
        this.x += this.speed * 1.5;
        this.y += this.speed;
    }
    destroy() {}
}

class Star {
    constructor(ctx, x = 0, y = 0) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.alive = true;
        this.radius = this.random(0.5, 2.5);
    }
    random(min, max) {
        return Math.random() * (max - min) + min;
    }
    draw() {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.radius > 1.5 ? '#fff' : '#ccc';
        ctx.fill();
        ctx.closePath();
    }
    update() {
        this.radius -= 0.03;
        if (this.radius < 0) {
            this.radius = 0;
            this.alive = false;
        }
    }
}

class FallStar extends Component {
    constructor() {
        super();
        this.particles = [];
        this.stars = [];
        this.w = window.screen.width > 1280 ? document.body.clientWidth : 1280;
        this.h = document.body.clientHeight - 60;
        this.padding = 50;
        this.ctx = null;
        this.animate = null;
    }

    componentDidMount() {
        this.init();
        this.draw();
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

    draw = () => {
        this.reset();
        if (this.particles.length < 10) {
            let particleCount = 1;
            while (particleCount--) {
                this.particles.push(
                    new Particle(this.ctx, this.random(0, this.w * 2 / 3), 0)
                );
            }
        }
        if (this.stars.length < 50) {
            this.stars.push(
                new Star(
                    this.ctx,
                    this.random(0, this.w),
                    this.random(0, this.h)
                )
            );
        }
        this.update();
        // setInterval(() => {
        //     this.draw();
        // }, 2000);
        this.animate = requestAnimationFrame(() => {
            this.draw();
        });
    };

    reset = () => {
        let ctx = this.ctx;
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba( 0, 0, 0, 1 )';
        ctx.fillRect(0, 0, this.w, this.h);
        ctx.globalCompositeOperation = 'lighter';
    };

    update = () => {
        const particles = [...this.particles];
        const stars = [...this.stars];
        for (let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];
            if (p.x < 0 || p.x > this.w || p.y < 0 || p.y > this.h) {
                this.particles.splice(i, 1);
            } else {
                p.update();
                p.draw();
            }
        }
        for (let i = stars.length - 1; i >= 0; i--) {
            let p = stars[i];
            if (p.alive) {
                p.update();
                p.draw();
            } else {
                this.stars.splice(i, 1);
            }
        }
    };

    componentWillUnmount() {
        if (this.animate) {
            cancelAnimationFrame(this.animate);
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

export default FallStar;
