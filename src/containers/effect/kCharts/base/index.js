class Base {
    constructor(ele, options) {
        this.ele = document.querySelector('#' + ele);
        this.width = options.width || document.body.offsetWidth;
        this.height = options.height || document.body.clientHeight;
        this.ctx = null;
        this.init();
    }
    init() {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext('2d');
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba( 15, 5, 2, 1 )';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.globalCompositeOperation = 'lighter';
        this.ctx = ctx;
        this.ele.appendChild(canvas);
    }
}

export default Base;
