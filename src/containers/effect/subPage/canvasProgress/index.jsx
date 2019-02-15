import React, { Component } from 'react';
import styles from './style.scss';

class Particle {
    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.size = Math.random() * 3;
        this.x = x - this.size;
        this.y = y;
        this.dx = 1 + Math.random() * 2;
        this.gravity = 1 + Math.random() * 3;
        this.downPoit = this.random(100, 200);
        this.down = false;
    }
    random(min, max) {
        return Math.random() * (max - min) + min;
    }
    draw() {
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

class Progress extends Component {
    constructor() {
        super();
        this.particles = [];
        this.w = document.body.clientWidth;
        this.h = document.body.clientHeight - 60;
        this.padding = 50;
        this.ctx = null;
        this.animate = null;
    }

    componentDidMount() {
        this.init();
        this.draw(0);
    }

    init = () => {
        const canvas = document.querySelector('#canvas');
        canvas.width = this.w;
        canvas.height = this.h;
        this.ctx = canvas.getContext('2d');
    };

    reset = () => {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.w, this.h);

        this.ctx.fillStyle = '#ccc';
        this.ctx.fillRect(this.padding, 300, this.w - this.padding * 2, 25);
    };

    drawBar = (w, color) => {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(this.padding, 300, w, 25);
    };

    draw = w => {
        if (w < this.w) {
            w += 4;
        } else {
            w = 0;
            this.particles = [];
        }
        this.reset();
        for (let i = 0; i < 10; i++) {
            this.particles.push(new Particle(this.ctx, w + this.padding, 298));
        }
        this.update();
        this.drawBar(w, 'green');
        this.animate = requestAnimationFrame(() => {
            this.draw(w);
        });
    };

    update = () => {
        const particles = this.particles;
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.x -= p.dx;

            if (p.down) {
                p.gravity += 0.1;
                p.y += p.gravity;
            } else {
                if (p.gravity < 0) {
                    p.down = true;
                } else {
                    p.y -= p.gravity;
                    p.gravity -= 0.1;
                }
            }

            p.draw();
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
                <canvas id="canvas">
                    Canvas is not supported in your browser.
                </canvas>
            </div>
        );
    }
}

export default Progress;
