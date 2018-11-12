import React, { Component } from 'react'
import { loginStore } from '../../store/index'
import style from './style.scss'
import Header from 'components/Header'
import Footer from 'components/Footer'
import LoginDialog from '../Login'
import RightScroll from 'components/RightScroll'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import resource from 'util/resource'

@observer
export default class App extends Component {
  @observable url = null

  cancel = () => {
    loginStore.toggleLogin(false)
  }

  render() {
    return (
      <div id={style['home-page']}>
        <Header />
        <div className={style.children}>{this.props.children}</div>
        <RightScroll />
        <Footer />
        <LoginDialog
          cancel={this.cancel}
          show={loginStore.LoginStatus}
          type={loginStore.LoginTab}
        />
      </div>
    )
  }
}
