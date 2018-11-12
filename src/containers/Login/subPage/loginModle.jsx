import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { observer } from 'mobx-react'
import { loginStore } from '../../../store/index'
import style from '../style.scss'
import resource from '.././../../util/resource'
import { LOGINSERVICES } from 'micro'
import EventEmitter from 'eventEmitter'

@observer
class LoginModle extends Component {
  constructor(props) {
    super(props)
    this.uuid = ''
    this.state = {
      code: false,
      src: '',
      loginMsg: '',
      checked: !!loginStore.userName,
      sendData: {}
    }
  }

  componentDidMount() {
      if(this.refs.username.value){
          this.state.sendData.username = this.refs.username.value;
          this.state.sendData.password = this.refs.password.value;
          this.setState({
              sendData: this.state.sendData
          })
      }
    // document.addEventListener('keydown', this.keyDownListener)
  }

  loginAction = () => {
    if (!this.state.sendData.username || !this.state.sendData.password) {
      this.setState({
        loginMsg: '请输入用户名和密码'
      })
      return
    }
    if (this.state.code && !this.state.sendData.imgcode) {
      this.setState({
        loginMsg: '请输入验证码'
      })
      return
    }
    resource
      .post('/kn/login', this.state.sendData)
      .then(res => {
        if (res.status === 200) {
          this.refs.username.value = ''
          this.refs.password.value = ''

          // 用户信息：用户名、用户ID
          sessionStorage.setItem('user', JSON.stringify(res.data))

          loginStore.toggleLogin(false)

          loginStore.showUserName(res.data.username)

          this.setState({
              loginMsg: ''
            })
        } else {
          let uuid = false
          if (res.imgcode) {
            uuid = true
            this.getImgCode()
          }
          this.setState({
            loginMsg: res.message,
            code: uuid
          })
        }
      })
      .catch(err => {
        this.setState({
          loginMsg: '出现错误'
        })
      })
  }

  // 获取图片验证码
  getImgCode = () => {
    let uuid = this.guid()
    this.uuid = uuid
    resource.get('/kn/getImgCode').then(res => {
      this.state.sendData.uuid = uuid
      this.setState({
        src: res.data.data,
        sendData: this.state.sendData
      })
    })
  }

  // 获取uuid
  guid = () => {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    return (
      S4() +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      S4() +
      S4()
    )
  }

  // 设置发送参数
  setData = e => {
    this.state.sendData[e.target.getAttribute('name')] = e.target.value
    this.setState({
      sendData: this.state.sendData
    })
  }

  keyDownListener = event => {
    let code = event.keyCode || event.which || event.charCode
    if (code == 13) {
      this.loginAction()
    }
  }

  setChecked = e => {
    this.setState({
      checked: e.target.checked
    })
  }

  componentWillUnmount = () => {
    // document.removeEventListener('keydown', this.keyDownListener)
  }

  render() {
    return (
      <div className={style.loginBox}>
        <h5 className={style.title}>登录</h5>
        <div className={style.loginItem}>
          <div className={style.common}>
            <i className="iconfont">&#xe644;</i>
            <input
              type="text"
              name="username"
              ref="username"
              onKeyDown={this.keyDownListener}
              onChange={e => {
                this.setData(e)
              }}
              placeholder="输入用户名"
            />
          </div>
          <div className={style.common}>
            <i className="iconfont">&#xe61a;</i>
            <input
              type="password"
              name="password"
              ref="password"
              onKeyDown={this.keyDownListener}
              onChange={e => {
                this.setData(e)
              }}
              placeholder="输入密码"
            />
          </div>
          <div
            className={style.codeBox + ' ' + style.logCode}
            style={{
              display: this.state.code ? 'block' : 'none',
              marginTop: '25px'
            }}
          >
            <input
              type="text"
              name="imgcode"
              onKeyDown={this.keyDownListener}
              onChange={e => {
                this.setData(e)
              }}
              placeholder="验证码"
            />
            <div className={style.codeImg} onClick={this.getImgCode}>
              <img src={this.state.src} alt="" />
            </div>
          </div>
          <div className={style.member}>
            <input
              type="checkbox"
              id="mem"
              checked={this.state.checked}
              onChange={this.setChecked}
            />
            <label htmlFor="mem">下次自动登录</label>
            <span
              onClick={() => {
                this.props.changeModle('find')
              }}
            >
              忘记密码？
            </span>
          </div>
          <p className={style.errTip}>{this.state.loginMsg}</p>
          <button
            className={style.loginAction}
            onClick={() => {
              this.loginAction()
            }}
          >
            登录
          </button>
          <div className={style.moreMessage}>
            <label>还没注册账户？</label>
            <span
              onClick={() => {
                this.props.changeModle('register')
              }}
            >
              免费注册
            </span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(LoginModle)
