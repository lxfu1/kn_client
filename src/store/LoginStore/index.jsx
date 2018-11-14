import React, { Component } from 'react'
import { observable, useStrict, action, runInAction } from 'mobx'
import resource from 'resource'
import { LOGINSERVICES } from 'micro'

useStrict(true)

class MyState {
    @observable LoginStatus = false

    @observable LoginTab = 'login'

    @observable message = ''

    @observable userName = getCookie('token')
        ? getCookie('user') ? JSON.parse(getCookie('user')).username : ''
        : ''

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
        this.userName = '';
        clearCookie('mem');
        loginOut()
    }

    @action.bound
    rememberPw(obj) {
        setCookie('mem', JSON.stringify(obj), 10 * 1000 * 6 * 60 * 24 * 30)
    }

    @action
    checkMember = async mem => {
        if (getCookie(mem) && !this.userName) {
            let user = await autoLogin()
            runInAction(() => {
                this.userName = user.username || ''
                this.userInfo = user
            })
        } else {
            if (!sessionStorage.getItem('token')) {
                clearCookie('user')
            }
        }
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

function autoLogin() {
    return new Promise((resolve, reject) => {
        let { username, password } = JSON.parse(getCookie('mem'))
        resource
            .post('/kn/login', { username, password })
            .then(res => {
                if (res.status === 200) {
                    // 保存token
                    sessionStorage.setItem('token', res.data.userId)
                    resolve(res.data)
                } else {
                    clearCookie('mem')
                    resolve()
                }
            })
            .catch(() => {
                clearCookie('mem')
                resolve()
            })
    })
}

const newState = new MyState()

export default newState
