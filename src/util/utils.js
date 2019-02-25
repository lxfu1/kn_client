import React from 'react';
import Loadable from 'react-loadable';

export const random = (from, to) => {
    if (!to) {
        to = from;
        from = 0;
    }
    return parseInt(Math.random() * (to - from) + from);
};

export function convertQueryString(params) {
    var query = '';
    if (!params) {
        return query;
    }
    for (let key in params) {
        if (query.indexOf('?') === -1) {
            query = query + `?${key}=${params[key]}`;
        } else {
            query = query + `&${key}=${params[key]}`;
        }
    }
    return query;
}

export const deepCopy = obj => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    let result = obj instanceof Array ? [] : {};
    for (let key in obj) {
        result[key] = deepCopy(obj[key]);
    }

    return result;
};

let Trim = function(str, is_global) {
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g, '');
    if (is_global.toLowerCase() == 'g') {
        result = result.replace(/\s/g, '');
    }
    return result;
};

// 身份验证
export const handleID = data => {
    let newData = Trim(data, 'g');
    if (/\s/g.test(newData)) {
        return '---';
    } else if (newData.length > 6 && newData.length < 12) {
        return newData.substr(0, 3) + '****' + newData.substr(7, 12);
    } else if (newData.length === 15) {
        return newData.substr(0, 6) + '******' + newData.substr(12, 15);
    } else if (newData.length === 18) {
        return newData.substr(0, 6) + '*******' + newData.substr(14, 18);
    } else {
        return '---';
    }
};

// TODO: 对样式进行优化
function LoadingComponent(props) {
    if (props.error) {
        // When the loader has errored
        return (
            <div
                style={{
                    marginTop: '20px',
                    textAlign: 'center',
                    fontSize: '24px'
                }}
            >
                加载失败，请重试 <button onClick={props.retry}>重试</button>
            </div>
        );
    } else if (props.timedOut) {
        // When the loader has taken longer than the timeout
        return (
            <div
                style={{
                    marginTop: '20px',
                    textAlign: 'center',
                    fontSize: '24px'
                }}
            >
                加载失败，请重试 <button onClick={props.retry}>重试</button>
            </div>
        );
    } else if (props.pastDelay) {
        // When the loader has taken longer than the delay
        return (
            <div
                style={{
                    marginTop: '20px',
                    textAlign: 'center',
                    fontSize: '24px'
                }}
            >
                加载中...
            </div>
        );
    } else {
        // When the loader has just started
        return null;
    }
}

function AsyncPage(loader, opts) {
    return Loadable(
        Object.assign(
            {
                loader: loader,
                loading: LoadingComponent,
                delay: 200,
                timeout: 5000
            },
            opts
        )
    );
}

export { AsyncPage };
