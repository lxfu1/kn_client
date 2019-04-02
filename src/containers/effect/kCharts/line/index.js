class Line {
    constructor(options) {
        this.x1 = options.x1;
        this.y1 = options.y1;
        this.x2 = options.x2;
        this.y2 = options.y2;
        this.strokeStyle = options.strokeStyle || '#ff0';
    }

    draw() {
        const ctx = kv.ctx;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }

    update() {}
    destroy() {}
}

export default Line;
