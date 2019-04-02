class Bezier {
    constructor(options) {
        this.x1 = options.x1;
        this.y1 = options.y1;
        this.x2 = options.x2;
        this.y2 = options.y2;
        this.strokeStyle = options.strokeStyle || '#ff0';
    }

    draw() {
        const ctx = kv.ctx;
        const { cX1, cy1, cx2, cy2 } = this.beizerPoints(this.x1, this.y1, this.x2, this.y2);
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        if (cy1 === cy1 && cy1 === this.y1) {
            ctx.lineTo(this.x2, this.y2);
        } else {
            ctx.bezierCurveTo(cX1, cy1, cx2, cy2, this.x2, this.y2);
        }
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
    }
    /**
     * 通过起始点、终点 => 控制点（需要做特殊处理， 目前没做）
     * @param {*} x1
     * @param {*} y1
     * @param {*} x2
     * @param {*} y2
     */
    beizerPoints(x1, y1, x2, y2) {
        const seriseX = 0.5;
        const seriseY = 0.1;
        const reduceY = y2 - y1;
        const reduceX = x2 - x1;
        const offsetX = Math.max(Math.abs(reduceX) * seriseX, 40);
        const offsetY = Math.max(Math.abs(reduceY) * seriseY, 20);
        const cX1 = reduceX > 0 ? x1 + offsetX : x1 - offsetX;
        const cx2 = reduceX > 0 ? x2 - offsetX : x2 + offsetX;
        let cy1;
        let cy2;
        if (reduceY === 0) {
            cy1 = y1;
            cy2 = y2;
        } else {
            cy1 = reduceY > 0 ? y1 + offsetY : y1 - offsetY;
            cy2 = reduceY > 0 ? y2 - offsetY : y2 + offsetY;
        }
        return { cX1, cy1, cx2, cy2 };
    }

    update() {}
    destroy() {}
}

export default Bezier;
