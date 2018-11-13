import React, { Component } from 'react'
import style from './style.scss'

export default class NoData extends Component {
  render() {
    return (
      <div className={style.noData}>
        <div className={style.img}></div>
        <p className={style.font}>暂无数据, 换个条件试试？</p>
      </div>
    )
  }
}
