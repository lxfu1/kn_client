/**
 * 单例模式
 * @param {*} fn
 * 唯一实例， 全局唯一访问接口
 */
const getSingle = function(fn) {
    var result;
    return function() {
        return result || (result = fn.apply(this, arguments));
    };
};
const createLoginLayer = function() {
    var div = document.createElement('div');
    div.innerHTML = '我是弹窗';
    div.style.display = 'none';
    document.body.appendChild(div);
    return div;
};
// 全局访问接口
const singleLoginLayer = getSingle(createLoginLayer);

const btn = document.getElementsByTagName('body')[0];
btn.onclick = function() {
    var singleLogin = singleLoginLayer();
    singleLogin.style.display = 'block';
};

/**
 * 代理模式
 * 把自己想做的事委托给别人
 */
var realyImage = (function() {
    var img = document.createElement('img');
    document.body.appendChild(img);
    return {
        setSrc: function(src) {
            img.src = src;
        }
    };
})();

var proxyImage = (function() {
    var img = new Image();
    img.onload = function() {
        realyImage.setSrc(this.src);
    };
    return {
        setSrc: function(src) {
            realyImage.setSrc('loading.jpg');
            img.src = src;
        }
    };
})();

proxyImage.setSrc('realy.jpg');

class Observe {
    constructor() {
        this.observers = [];
    }
    addOb(ob) {
        this.observers.push(ob);
    }
    notice(message) {
        this.observers.forEach(ob => {
            ob(message);
        });
    }
}
const ob1 = function(m) {
    console.log('1:' + m);
};
const ob2 = function(m) {
    console.log('2:' + m);
};

const Ob = new Observe();
Ob.addOb(ob1);
Ob.addOb(ob2);

// 广播
Ob.notice('习大大来了');

/**
 * 命令模式
 */
var setCommand = function(button, func) {
    button.onclick = function() {
        func.execute();
    };
};

var MenuBtn = {
    refresh: function() {
        console.log('我的功能是刷新');
    }
};

var RefreshCommand = function(receiver) {
    return {
        execute: function() {
            receiver.refresh();
        }
    };
};

var refresh = RefreshCommand(MenuBtn);
setCommand(btn1, refresh);
