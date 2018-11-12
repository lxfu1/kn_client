import React, {Component} from "react"
import style from '../style.scss'
import { observer } from 'mobx-react';
import {loginStore} from '../../../store/index';
import Validator from '.././../../util/Validator'
import resource from '.././../../util/resource'
import {LOGINSERVICES} from 'micro'

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
                imgcode: '',
                phone: '',
                phonecode: '',
                uuid: ''
            }
        }
    }

    componentDidMount() {
        this.check.bindOnBlur();
        this.getImgCode();
    }

    nextStep = () => {
        let ver = this.check.checkRule('finds');
        if (ver) {
            resource.get(`${LOGINSERVICES}/security/checkcode?phone=${this.state.modifyData.phone}&code=${this.state.modifyData.code}&uuid=${this.uuid}`,).then((res) => {
                if (res.status === 200) {
                    loginStore.outUser();
                    this.props.changeModle('modify', res.data)
                } else {
                    this.setState({
                        regMsg: res.message || '数据有误'
                    })
                }
            })
        }
    };

    //获取图片验证码
    getImgCode = ()=> {
        let uuid = this.guid();
        this.uuid = uuid;
        resource.get('/kn/getImgCode').then((res) => {
            this.state.modifyData.uuid = uuid;
            this.setState({
                src: res.data.data,
                modifyData: this.state.modifyData
            })
        });
    };

    //获取手机验证码
    getPhoneCode = ()=> {
        let phone, uuid, imgcode;
        phone = this.state.modifyData.phone;
        uuid = this.uuid;
        imgcode = this.state.modifyData.imgcode;
        if (phone && imgcode) {
            resource.get(`${LOGINSERVICES}/security/passwordPhonecode?phone=${phone}&imgcode=${imgcode}&uuid=${uuid}`).then((res) => {
                if (res.status === 200) {
                    this.state.modifyData.phonecode = '';
                    this.refs.codePhone.value = '';
                    this.setState({
                        text: '60s',
                        times: true,
                        modifyData: this.state.modifyData
                    }, ()=> {
                        this.setInter();
                    })
                } else {
                    this.setState({
                        regMsg: res.message
                    })
                    this.sleep(2000);
                }
            });
        } else {
            this.setState({
                regMsg: !imgcode ? '请输入验证码' : '请输入手机号'
            })
            if (!this.time) {
                this.sleep(2000);
            }
        }
    };

    //获取uuid
    guid = () => {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };

    //设置发送参数
    setData = (e) => {
        this.state.modifyData[e.target.getAttribute('name')] = e.target.value;
        this.setState({
            modifyData: this.state.modifyData
        })
    };

    sleep = (time) => {
        this.time = setTimeout(()=> {
            this.time = null;
            this.setState({
                regMsg: ''
            })
        }, time)
    }

    setInter = ()=> {
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
            }
        }
        return (
            <div className={style.loginBox}>
                <h5 className={style.title}>密码找回</h5>
                <div className={style.findItem} id="finds">
                    <div className={style.codeBox}>
                        <input type="text" className="e-validator" name="imgcode" data-options="require"
                               onChange={(e)=>{this.setData(e)}} placeholder="图像验证码"/>
                        <div className={style.codeImg}
                             onClick={this.getImgCode}
                             dangerouslySetInnerHTML={{__html: this.state.src}}>
                        </div>
                    </div>
                    <input type="text" id={style['inputs']} className="e-validator" name="phone"
                           data-options="require phone" onChange={(e)=>{this.setData(e)}} placeholder="手机号码"/>
                    <div className={style.codeBox}>
                        <input type="text" className="e-validator" ref="codePhone" name="code"
                               data-options="require number" onChange={(e)=>{this.setData(e)}} placeholder="手机验证码"/>
                        <div className={style.codeImg}>
                            <button style={codeStyle}
                                    onClick={this.state.times ? null : ()=>{this.getPhoneCode()}}>{this.state.text}</button>
                        </div>
                    </div>
                    <p className={style.errTip}>{this.state.regMsg}</p>
                    <button className={style.loginAction} onClick={()=>{this.nextStep()}}>下一步</button>
                    <div className={style.moreMessage}>
                        <span onClick={()=>{this.props.changeModle('login')}}>返回登录</span>
                    </div>
                </div>
            </div>
        )
    }
}
