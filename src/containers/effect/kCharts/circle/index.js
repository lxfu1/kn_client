class Circle {
    constructor(options) {
        this.x = options.x;
        this.y = options.y;
        this.r = options.r;
        this.fillStyle = options.fillStyle || '#ff0';
    }

    draw() {
        const ctx = kv.ctx;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.fillStyle;
        ctx.fill();
        ctx.closePath();
    }

    update(options) {
        this.x = options.x;
        this.y = options.y;
        this.r = options.r;
        this.fillStyle = options.fillStyle || '#ff0';
        this.draw();
    }
    destroy() {}
}

export default Circle;
