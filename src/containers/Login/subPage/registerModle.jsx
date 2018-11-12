import React, {Component} from "react"
import {NavLink} from 'react-router-dom'
import style from '../style.scss'
import resource from '.././../../util/resource'
import Validator from '.././../../util/Validator'
import {LOGINSERVICES} from 'micro'

export default class RegisterModle extends Component {

    constructor(props){
      super(props);
      this.uuid = '';
      this.check = new Validator();
      this.time =null;
      this.interval = null;
      this.state = {
        count: 60,
        src: '',
        regMsg: '',
        getCode: false,
        text: '获取验证码',
        times: null,
        registerData: {
          userFrom: 'WEB',
          imgcode: '',
          password: '',
          phone: '',
          phonecode: '',
          repassword: '',
          username: '',
          uuid: ''
        }
      }
    }

    componentDidMount(){
      this.check.bindOnBlur();
      this.getImgCode();
    }

    register = () => {
      let ver = this.check.checkRule('verify');
      if(ver){
        resource.post(LOGINSERVICES+'/security/register',this.state.registerData).then((res) =>{
          if(res.status === 200){
            this.props.changeModle('regSuccess')
          }else{
            this.setState({
              regMsg: res.message
            })
            this.sleep(2000);
          }
        })
      }
    };

    //获取图片验证码
    getImgCode = ()=>{
      let uuid = this.guid();
      this.uuid = uuid;
      resource.get('/kn/getImgCode').then((res) =>{
        this.state.registerData.uuid = uuid;
        this.setState({
          src: res.data.data,
          registerData: this.state.registerData
        })
      });
    };

    //获取手机验证码
    getPhoneCode = ()=>{
      if(this.state.getCode){
        return;
      }
      let phone, uuid, imgcode;
      phone = this.state.registerData.phone;
      uuid = this.uuid;
      imgcode = this.state.registerData.imgcode;
      if(!/^1[34578]\d{9}$/.test(phone)){
        return;
      }
      if(phone && imgcode){
        resource.get(`${LOGINSERVICES}/security/phonecode?phone=${phone}&imgcode=${imgcode}&uuid=${uuid}`).then((res) =>{
          if(res.status === 200){
            this.state.registerData.phonecode = '';
            this.refs.codePhone.value = '';
            this.setState({
              text: '60s',
              times: true,
              registerData: this.state.registerData
            },()=>{
              this.setInter();
            })
          }else{
            this.setState({
              regMsg: res.message
            })
            this.sleep(2000);
          }
        });
      }else{
        this.setState({
          regMsg: !imgcode ? '请输入验证码':'请输入手机号'
        })
        if(!this.time){
          this.sleep(2000);
        }
      }
    };

    //获取uuid
    guid = () => {
      function S4(){
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      };
      return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    };

    //设置发送参数
    setData = (e) =>{
      this.state.registerData[e.target.getAttribute('name')] = e.target.value;
      this.setState({
        registerData: this.state.registerData
      })
      if(e.target.getAttribute('name') == 'phone' && /^1[34578]\d{9}$/.test(e.target.value)){
        resource.get(`${LOGINSERVICES}/security/checkPhone/${e.target.value}`).then((res) =>{
          if(res.status === 200){
            if(res.data){
              this.setState({
                getCode: true,
                regMsg: '手机号已被注册'
              })
            }else{
              this.setState({
                getCode: false,
                regMsg: ''
              })
            }
          }
        }).catch(()=>{
          this.setState({
            getCode: false
          })
        });
      }
    };

    sleep = (time) =>{
      if(this.time) {
        return;
      }
      this.time = setTimeout(()=>{
        this.time = null;
        this.setState({
          regMsg: ''
        })
      },time)
    };

    setInter =()=>{
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
        }else{
          this.setState({
            text: t + 's'
          });
        }
      }, 1000);
    };

    componentWillUnmount(){
      if(this.interval){
        clearInterval(this.interval);
      }
    }

    render() {
      let codeStyle ;
      if(this.state.times){
        codeStyle = {
          background: '#737373',
          cursor: 'not-allowed',
          border: '1px solid #737373'
        }
      }
        return (
            <div className={style.loginBox}>
              <h5 className={style.title}>注册</h5>
                <div className={style.registerItem} id="verify">
                    <input type="text" className="e-validator" name="phone" data-options="require phone"  onChange={(e)=>{this.setData(e)}} placeholder="手机号码" />
                    <div className={style.codeBox}>
                        <input type="text" className="e-validator" name="imgcode" data-options="require"  onChange={(e)=>{this.setData(e)}} placeholder="图像验证码"/>
                        <div className={style.codeImg}
                             onClick={this.getImgCode}
                             dangerouslySetInnerHTML = {{__html: this.state.src}}>
                        </div>
                    </div>
                    <div className={style.codeBox}>
                      <input type="text" ref="codePhone"  className="e-validator" name="phonecode" data-options="require number"  onChange={(e)=>{this.setData(e)}} placeholder="手机验证码" />
                      <div className={style.codeImg}>
                        <button style={codeStyle} onClick={this.state.times ? null : ()=>{this.getPhoneCode()}}>{this.state.text}</button>
                      </div>
                    </div>
                    <input type="password" className="e-validator" name="password" data-options="require pw" onChange={(e)=>{this.setData(e)}} placeholder="密码，6~20位"/>
                    <input type="password" className="e-validator" name="repassword" data-options="require pw" onChange={(e)=>{this.setData(e)}} placeholder="重复密码"/>
                    <p className={style.errTip}>{this.state.regMsg}</p>
                    <button className={style.loginAction} style={{marginTop: '5px'}} onClick={this.register}>立即注册</button>
                    <div className={style.moreMessage}>
                      <label>已有账户？</label>
                        <span onClick={()=>{this.props.changeModle('login')}}>立即登录</span>
                    </div>
                </div>
            </div>
        )
    }
}
