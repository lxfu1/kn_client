const cards = [
    {
        src: require('./images/html5-canvas-loader.png'),
        height: 128,
        title: 'canvas进度条',
        link: '/main/effect/p',
        color: '#fff'
    },
    {
        src: require('./images/html5-canvas-fireworks.jpg'),
        height: 201,
        title: 'canvas烟花',
        link: '/main/effect/f',
        color: '#fff'
    },
    {
        src: require('./images/mp.png'),
        height: 300,
        title: '3D地球',
        link: '/main/effect/m',
        color: '#fff'
    },
    {
        src: require('./images/ld.png'),
        height: 200,
        title: '带尾巴的菊花圈',
        link: '/main/effect/l',
        color: '#fff'
    },
    {
        src: require('./images/html5-canvas-loader.png'),
        height: 400
    },
    {
        src: require('./images/html5-canvas-loader.png'),
        height: 200
    },
    {
        src: require('./images/html5-canvas-loader.png'),
        height: 320
    },
    {
        src: require('./images/html5-canvas-loader.png'),
        height: 170
    },
    {
        src: require('./images/html5-canvas-loader.png'),
        height: 100
    },
    {
        src: require('./images/html5-canvas-loader.png'),
        height: 150
    },
    {
        src: require('./images/html5-canvas-loader.png'),
        height: 180
    }
];

/**
 * 瀑布流
 */
function fallsFlow(data) {
    if (!data || !data.length) {
        return data;
    }
    const BoxWidth = 1240;
    const Col = 4; // 一排放几个
    const ElementWidth = (BoxWidth / Col).toFixed(3);
    let arr = [];
    for (let i = 0; i < Col; i++) {
        arr.push(data[i].height);
        data[i].style = {
            left: ElementWidth * i + 'px',
            width: ElementWidth + 'px',
            top: 0 + 'px',
            height: data[i].height + 'px'
        };
    }
    for (let i = 4; i < data.length; i++) {
        const min = Math.min(...arr);
        const index = arr.findIndex(item => item === min);
        arr[index] += data[i].height;
        data[i].style = {
            left: ElementWidth * index + 'px',
            top: min + 'px',
            width: ElementWidth + 'px',
            height: data[i].height + 'px'
        };
    }
    return {
        data,
        maxHeight: Math.max(...arr)
    };
}

const FallCard = fallsFlow(cards);

export { FallCard };
