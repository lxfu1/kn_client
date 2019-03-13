import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { loginStore } from '../../../store/index';
import style from '../style.scss';
import resource from '.././../../util/resource';
import { LOGINSERVICES } from '@/constants/storage';

@observer
class LoginModle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginMsg: '',
            checked: !!loginStore.userName,
            username: '',
            password: ''
        };
    }

    loginAction = () => {
        let { username, password, checked } = this.state;
        if (!username || !password) {
            this.setState({
                loginMsg: '请输入用户名和密码'
            });
            return;
        }
        resource
            .post('/kn/login', { username, password, checked })
            .then(res => {
                if (res.status === 200) {
                    sessionStorage.setItem('token', res.data.userId);
                    loginStore.toggleLogin(false);
                    loginStore.showUserName(res.data.username);
                    loginStore.setCookie('user', JSON.stringify(res.data), 5 * 24 * 60 * 60 * 1000);
                    loginStore.rememberPw({ username, password }, checked);
                    this.setState({
                        loginMsg: '',
                        username: '',
                        password: ''
                    });
                } else {
                    this.setState({
                        loginMsg: res.message
                    });
                }
            })
            .catch(err => {
                this.setState({
                    loginMsg: '出现错误'
                });
            });
    };

    // 设置发送参数
    setData = (type, value) => {
        this.setState({
            [type]: value
        });
    };

    setChecked = e => {
        this.setState({
            checked: e.target.checked
        });
    };

    render() {
        const { username, password, checked, loginMsg } = this.state;
        return (
            <div className={style.loginBox}>
                <h5 className={style.title}>登录</h5>
                <div className={style.loginItem}>
                    <div className={style.common}>
                        <i className="iconfont">&#xe644;</i>
                        <input
                            type="text"
                            value={username}
                            onChange={e => {
                                this.setData('username', e.target.value);
                            }}
                            placeholder="手机号"
                        />
                    </div>
                    <div className={style.common}>
                        <i className="iconfont">&#xe61a;</i>
                        <input
                            type="password"
                            value={password}
                            onChange={e => {
                                this.setData('password', e.target.value);
                            }}
                            placeholder="输入密码"
                        />
                    </div>
                    <div className={style.member}>
                        <input type="checkbox" id="mem" checked={checked} onChange={this.setChecked} />
                        <label htmlFor="mem">自动登录</label>
                        <span
                            onClick={() => {
                                this.props.changeModle('find');
                            }}
                        >
                            忘记密码？
                        </span>
                    </div>
                    <p className={style.errTip}>{loginMsg}</p>
                    <button
                        className={style.loginAction}
                        onClick={() => {
                            this.loginAction();
                        }}
                    >
                        登录{' '}
                    </button>
                    <div className={style.moreMessage}>
                        <label>还没注册账户？</label>
                        <span
                            onClick={() => {
                                this.props.changeModle('register');
                            }}
                        >
                            免费注册
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(LoginModle);
