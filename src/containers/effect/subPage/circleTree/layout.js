/**
 * 树形布局， 默认向右
 * @param {*} data
 */
const tree = (d, options) => {
    let data = _copy(d);
    let obj = {
        0: 1
    };
    let counts = {
        0: 0
    };
    _getLevelAndCounts(data, obj, 0, counts);
    const { maxVertical } = _getMaxDegree(obj, options);
    _setPosition(data, obj, options, maxVertical);
    return data;
};

/**
 * 数据装换，获取层级和当前层级节点数
 * @param {*} data
 * @param {*} obj
 * @param {*} level
 * @param {*} counts
 */
function _getLevelAndCounts(data, obj, level, counts) {
    if (!data) {
        return;
    }
    data.level = level;
    data.index = counts[level];
    if (data.children) {
        let _data = data.children;
        obj[level + 1] = obj[level + 1] ? obj[level + 1] : 0;
        obj[level + 1] += _data.length;
        counts[level + 1] = counts[level + 1] ? counts[level + 1] : 0;
        for (let i = 0; i < _data.length; i++) {
            _data[i].level = level + 1;
            _data[i].index = counts[level + 1];
            if (_data[i].children && _data[i].children.length) {
                _getLevelAndCounts(_data[i], obj, level + 1, counts);
            }
            counts[level + 1] += 1;
        }
    }
}

/**
 * 找出最大节点层级
 * @param {*} obj
 * @param {*} options
 */
function _getMaxDegree(obj, options) {
    let maxNodes = 0;
    let maxNodesLevel = 0;
    for (let key in obj) {
        if (obj[key] > maxNodes) {
            maxNodes = obj[key];
            maxNodesLevel = Number(key);
        }
    }

    const maxHorization = maxNodesLevel * options.hd;
    const maxVertical = (maxNodes - 1) * options.vd;

    return { maxHorization, maxVertical };
}

/**
 * 设置节点x、y
 * @param {*} data
 * @param {*} obj
 * @param {*} options
 * @param {*} maxVerticalDistance
 */
function _setPosition(data, obj, options, maxVerticalDistance) {
    if (!data) {
        return;
    }
    data.x = options.l + data.level * options.hd;
    const between = obj[data.level] === 1 ? 0 : maxVerticalDistance / (obj[data.level] - 1);
    if (!data.y) {
        data.y = options.baseVertical + between * (data.index - Math.floor(obj[data.level] / 2));
    }
    if (data.children) {
        let _data = data.children;

        for (let i = 0; i < _data.length; i++) {
            const childrenBetween = obj[_data[i].level] === 1 ? 0 : maxVerticalDistance / (obj[_data[i].level] - 1);
            _data[i].x = options.l + _data[i].level * options.hd;
            _data[i].y = data.y + childrenBetween * (_data[i].index - Math.floor(obj[_data[i].level] / 2));
            if (_data[i].children && _data[i].children.length) {
                _setPosition(_data[i], obj, options, maxVerticalDistance);
            }
        }
    }
}

/**
 * 对象深拷贝
 * @param {*} d
 */
function _copy(d) {
    return JSON.parse(JSON.stringify(d));
}

export { tree };
