import React, { Component } from 'react';
import style from '../style.scss';
import { message } from 'antd';
import { observer } from 'mobx-react';
import Validator from '.././../../util/Validator';
import resource from '.././../../util/resource';

@observer
export default class FindModle extends Component {
    constructor(props) {
        super(props);
        this.uuid = '';
        this.check = new Validator();
        this.time = null;
        this.interval = null;
        this.state = {
            count: 60,
            src: '',
            regMsg: '',
            text: '获取验证码',
            times: null,
            modifyData: {
                phone: '',
                phonecode: '',
                password: '',
                repassword: ''
            }
        };
    }

    componentDidMount() {
        this.check.bindOnBlur();
    }

    sure = () => {
        let ver = this.check.checkRule('finds');
        if (ver) {
            let { modifyData } = this.state;
            if (modifyData.password !== modifyData.repassword) {
                message.warning('密码不一致');
                return;
            }
            resource.post('/kn/findPassword', modifyData).then(res => {
                if (res.status === 200) {
                    this.props.changeModle('findSuccess');
                } else {
                    this.setState({
                        regMsg: res.message
                    });
                    this.sleep(5000);
                }
            });
        }
    };

    // 获取手机验证码
    getPhoneCode = () => {
        let phone = this.state.modifyData.phone;

        if (!/^1[34578]\d{9}$/.test(phone)) {
            message.warning('请输入正确的手机号');
            return;
        }
        resource.get(`/kn/getMessageCode/${phone}`).then(res => {
            if (res.status === 200) {
                this.codeId = res.data.codeId;
                this.setState(
                    {
                        text: '60s',
                        times: true
                    },
                    () => {
                        this.setInter();
                    }
                );
            } else {
                this.setState({
                    regMsg: res.message
                });
                this.sleep(5000);
            }
        });
    };

    // 设置发送参数
    setData = e => {
        this.state.modifyData[e.target.getAttribute('name')] = e.target.value;
        this.setState({
            modifyData: this.state.modifyData
        });
    };

    sleep = time => {
        this.time = setTimeout(() => {
            this.time = null;
            this.setState({
                regMsg: ''
            });
        }, time);
    };

    setInter = () => {
        let t = this.state.count;
        this.interval = setInterval(() => {
            t -= 1;
            if (t < 1) {
                clearInterval(this.interval);
                this.setState({
                    count: 60,
                    times: null,
                    text: '获取验证码'
                });
            } else {
                this.setState({
                    text: t + 's'
                });
            }
        }, 1000);
    };

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    render() {
        let codeStyle;
        if (this.state.times) {
            codeStyle = {
                background: '#737373',
                cursor: 'not-allowed',
                border: '1px solid #737373'
            };
        }
        return (
            <div className={style.loginBox}>
                <h5 className={style.title}>密码找回</h5>
                <div className={style.findItem} id="finds">
                    <input
                        type="text"
                        className="e-validator"
                        name="phone"
                        data-options="require phone"
                        onChange={this.setData}
                        placeholder="手机号码"
                    />
                    <div className={style.codeBox}>
                        <input
                            type="text"
                            className="e-validator"
                            name="phonecode"
                            data-options="require number"
                            onChange={this.setData}
                            placeholder="手机验证码"
                        />
                        <div className={style.codeImg}>
                            <button
                                style={codeStyle}
                                onClick={
                                    this.state.times
                                        ? null
                                        : () => {
                                              this.getPhoneCode();
                                          }
                                }
                            >
                                {this.state.text}
                            </button>
                        </div>
                    </div>
                    <input
                        type="password"
                        className="e-validator"
                        name="password"
                        data-options="require pw"
                        onChange={this.setData}
                        placeholder="密码，6~20位"
                    />
                    <input
                        type="password"
                        className="e-validator"
                        name="repassword"
                        data-options="require pw"
                        onChange={this.setData}
                        placeholder="重复密码"
                    />
                    <p className={style.errTip}>{this.state.regMsg}</p>
                    <button
                        className={style.loginAction}
                        onClick={() => {
                            this.sure();
                        }}
                    >
                        确认
                    </button>
                    <div className={style.moreMessage}>
                        <span
                            onClick={() => {
                                this.props.changeModle('login');
                            }}
                        >
                            返回登录
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}
