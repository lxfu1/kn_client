import React, {Component} from "react"
import style from '../style.scss'
import resource from '.././../../util/resource'
import {LOGINSERVICES} from 'micro'

export default class ModifyModle extends Component {

  constructor(props){
    super(props);
    this.time = null;
    this.data ={
      newpassword: '',
      repassword: ''
    };
    this.state = {
      errMsg: ''
    }
  }

  sureModify =()=>{
    let flag = true;
    let ms = '';
    if(!this.validator(this.data.newpassword) || !this.validator(this.data.repassword)){
      flag = false;
      ms = '密码长度应为6~20位';
    }
    if(this.data.newpassword !== this.data.repassword){
      flag = false;
      ms = '密码不一致';
    }

    if(flag){
      this.modifyPs();
    }else{
      this.setState({
        errMsg: ms
      })
      this.sleep(4000);
    }
  };

  validator = (value) =>{
    return /^[0-9A-Za-z\-_,.:\""\&\()\s　]+$/.test(value) && value.length > 5 && value.length < 21;
  };

  //找回密码
  modifyPs = ()=>{
    //let data = Object.assign({},this.props.data,this.data);
    this.data.phoneToken = this.props.data;
    resource.post(LOGINSERVICES+'/security/changeByPhone',this.data).then((res) =>{
      if(res.status === 200){
        this.props.changeModle('findSuccess')
      }else{
        this.setState({
          errMsg: res.message
        })
      }
    })
  }

  setData = (e)=>{
    this.data[e.target.getAttribute('name')] = e.target.value;
  }

  sleep = (time) =>{
    if(this.time){
      return;
    }
    this.time = setTimeout(()=>{
      this.time = null;
      this.setState({
        errMsg: ''
      })
    },time)
  };

  render() {
    return (
      <div className={style.loginBox}>
        <div className={style.loginItem}>
          <input type="password" className={style.bbdInput} name="newpassword"  onChange={(e)=>{this.setData(e)}} placeholder="密码，6~20位"/>
          <input type="password" className={style.bbdInput} name="repassword" onChange={(e)=>{this.setData(e)}} placeholder="重复密码"/>
          <p className={style.errTip}>{this.state.errMsg}</p>
          <button className={style.loginAction} onClick={this.sureModify}>确认</button>
          <div className={style.moreMessage}>
            <span onClick={()=>{this.props.changeModle('login')}}>返回登录</span>
          </div>
        </div>
      </div>
    )
  }
}
