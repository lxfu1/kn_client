import React, { Component } from 'react'
import { observable, useStrict, action, runInAction } from 'mobx'
import resource from 'resource'
import { LOGINSERVICES } from 'micro'

useStrict(true)

class MyState {
  @observable LoginStatus = false

  @observable LoginTab = 'login'

  @observable message = ''

  @observable
  userName = sessionStorage.getItem('token')
    ? getCookie('user') ? JSON.parse(getCookie('user')).username : ''
    : ''

  constructor() {
    this.userInfo = sessionStorage.getItem('token')
      ? JSON.parse(getCookie('user'))
      : null
  }

  @action.bound
  toggleLogin(status, type, message) {
    this.LoginStatus = status
    this.LoginTab = type || 'login'
    this.message = message
  }

  @action.bound
  showUserName(name) {
    this.userName = name || ''
  }

  @action.bound
  outUser() {
    this.userName = ''
    loginOut()
  }

  @action.bound
  setCookie(...obj) {
    setCookie(...obj)
  }
}

function loginOut() {
  resource.get('/kn/logout');
}

// 设置cookie
function setCookie(name, value, time) {
  let exp = new Date()
  exp.setTime(exp.getTime() + time)
  document.cookie =
    name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=/'
}

// cookie
function getCookie(name) {
  let arr,
    reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if ((arr = document.cookie.match(reg))) {
    return unescape(arr[2])
  } else {
    return null
  }
}

// cookie
function clearCookie(name) {
  let exp = new Date()
  exp.setTime(exp.getTime() - 1)
  let cval = getCookie(name)
  if (cval != null) {
    document.cookie =
      name + '=' + escape(cval) + ';expires=' + exp.toGMTString() + ';path=/'
  }
}

const newState = new MyState()

export default newState
