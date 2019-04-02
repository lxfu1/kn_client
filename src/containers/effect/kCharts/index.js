import Base from './base';
import Circle from './circle';
import Line from './line';
import Bezier from './bezier';

window.kv = {};
class KCharts extends Base {
    constructor(ele, options) {
        super(ele, options);
        window.kv.ctx = this.ctx;
    }
    line(options) {
        new Line(options).draw();
    }
    circle(options) {
        new Circle(options).draw();
    }
    bezier(options) {
        new Bezier(options).draw();
    }
}

export default KCharts;
