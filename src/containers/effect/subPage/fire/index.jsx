import React, { Component } from 'react';
import styles from './style.scss';

class Particle {
    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.x = x + this.random(-40, 40);
        this.y = y;
        this.radius = this.random(5, 15);
        this.upSpeed = this.random(1, 4);
        this.decay = this.random(0.1, 0.3);
        this.alpha = this.random(0.8, 1);
        this.alive = true;
    }

    draw() {
        const ctx = this.ctx;
        ctx.beginPath();
        const grd = ctx.createRadialGradient(
            this.x,
            this.y,
            this.radius,
            this.x,
            this.y - this.radius / 2,
            0
        );
        grd.addColorStop(0, 'rgb( 15, 5, 2 )');
        grd.addColorStop(1, 'rgb( 30, 10, 2 )');
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.closePath();
    }
    random(min, max) {
        return Math.random() * (max - min) + min;
    }
    update() {
        this.radius -= this.decay;
        this.alpha -= 0.01;

        if (this.radius < 0 || this.alpha < 0) {
            this.radius = 0;
            this.alpha = 0;
        }
        this.x += this.random(-2, 2);
        this.y -= this.upSpeed;
        this.alive = this.radius > 0;
    }
    destroy() {}
}

class Fire extends Component {
    constructor() {
        super();
        this.particles = [];
        this.w = window.screen.width > 1280 ? document.body.clientWidth : 1280;
        this.h = document.body.clientHeight - 60;
        this.x = this.w / 2;
        this.y = this.h - 150;
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
        canvas.addEventListener(
            'mousemove',
            e => {
                this.x = e.pageX;
                this.y = e.pageY - 60;
            },
            false
        );
    };

    random = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    draw = () => {
        this.reset();
        let particleCount = 15;
        while (particleCount--) {
            this.particles.push(new Particle(this.ctx, this.x, this.y));
        }
        this.update();
        this.animate = requestAnimationFrame(() => {
            this.draw();
        });
    };

    reset = () => {
        let ctx = this.ctx;
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba( 15, 5, 2, 1 )';
        ctx.fillRect(0, 0, this.w, this.h);
        ctx.globalCompositeOperation = 'lighter';
    };

    update = () => {
        const particles = [...this.particles];
        for (let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];
            if (p.alive) {
                p.draw();
                p.update();
            } else {
                this.particles.splice(i, 1);
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

export default Fire;
