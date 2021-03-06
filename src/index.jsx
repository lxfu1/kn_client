import 'es5-shim';
import 'es5-shim/es5-sham';
import 'es6-promise';
import 'match-media';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import * as stores from './store';

import './static/scss/app.global.scss';
import 'rodal/lib/rodal.css';

import Routes from './routes';

// 修改UI
const mount = document.getElementById('root');

const render = Component => {
    ReactDOM.render(
        <Provider {...stores}>
            <Component />
        </Provider>,
        mount
    );
};

render(Routes);
