import React, { Component } from 'react';
import styles from './style.scss';

class Particle {
    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.hue = this.random(0, 360);
        this.coordinates = [[x, y]];
        this.coordinatesCount = 5;
        this.w = this.random(1, 3);
        while (this.coordinatesCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        this.speed = this.random(1, 10);
        this.alpha = 1;
        this.friction = 0.95;
        this.brightness = this.random(50, 80);
        this.gravity = 1;
        this.angle = this.random(0, Math.PI * 2);
        this.decay = this.random(0.015, 0.02);
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.moveTo(
            this.coordinates[this.coordinates.length - 1][0],
            this.coordinates[this.coordinates.length - 1][1]
        );

        this.ctx.lineTo(this.x, this.y);
        this.ctx.lineWidth = this.w;
        this.ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
        this.ctx.stroke();
    }
    random(min, max) {
        return Math.random() * (max - min) + min;
    }
    update() {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        this.speed *= this.friction;
        this.x += Math.sin(this.angle) * this.speed;
        this.y += Math.cos(this.angle) * this.speed + this.gravity;
        this.hue += 0.5;
        this.alpha -= this.decay;
    }
}

class FireWork extends Component {
    constructor() {
        super();
        this.particles = [];
        this.w = window.screen.width > 1280 ? document.body.offsetWidth : 1280;
        this.h = document.body.clientHeight - 60;
        this.padding = 50;
        this.ctx = null;
        this.animate = null;
        this.time = null;
    }

    componentDidMount() {
        this.init();
        this.draw();

        this.time = setInterval(() => {
            this.draw();
        }, 1500);
    }

    init = () => {
        const canvas = document.querySelector('#canvas');
        canvas.addEventListener(
            'click',
            e => {
                if (this.time) {
                    clearInterval(this.time);
                }
                this.draw(e.pageX, e.pageY - 60);
                this.time = setInterval(() => {
                    this.draw();
                }, 1500);
            },
            false
        );
        canvas.width = this.w;
        canvas.height = this.h;
        this.ctx = canvas.getContext('2d');
    };

    random = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    draw = (px, py) => {
        this.particles = [];
        if (this.animate) {
            cancelAnimationFrame(this.animate);
        }
        let particleCount = 100;
        const x = px || this.random(100, this.w - 100);
        const y = py || this.random(50, this.h / 2);
        while (particleCount--) {
            this.particles.push(new Particle(this.ctx, x, y));
        }
        this.update();
    };

    update = () => {
        let ctx = this.ctx;
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(0, 0, this.w, this.h);
        ctx.globalCompositeOperation = 'lighter';
        let particles = this.particles;
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.update();
            p.draw();
        }

        this.animate = requestAnimationFrame(() => {
            this.update();
        });
    };

    componentWillUnmount() {
        if (this.animate) {
            cancelAnimationFrame(this.animate);
        }
        if (this.time) {
            clearInterval(this.time);
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

export default FireWork;
