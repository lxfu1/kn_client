import React, { Component } from 'react'
import style from './style.scss'
import data from './IMAGES/35.gif'

export default class Loading extends Component {
  render() {
    const { className } = this.props
    return (
      <section
        className={style.loading + ((className && ' ' + className) || '')}
      >
        <img src={data} alt="" />
        <p className={style.font}>加载中</p>
      </section>
    )
  }
}
