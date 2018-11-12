// 上帝保佑,永无bug

import React, { Component } from 'react'
import style from './style.scss'
// import {immutableRenderDecorator} from 'react-immutable-render-mixin'

// @immutableRenderDecorator
export default class Rank extends Component {
  constructor(props) {
    super(props)
    this.timer = null
  }

  componentDidMount() {
    setTimeout(this.animate, 0)
  }

  animate = () => {
    this.refs.column.style.width = this.refs.column.getAttribute('value') / 400 * 100 + '%'
    this.refs.lei.style.left = this.refs.column.getAttribute('value') / 400 * 100 + 2 + '%'
    // this.width = this.refs.column.style.width;
  }

  render() {
    const item = this.props.item
    return (
      <dl className={style.rank}>
        <dd>
          <div value={item.value} ref="column" style={{ background: this.props.color === 1 ? '#e3598c' : '#37b2f5' }} />
          <span ref="lei">{item.value}</span>
        </dd>
      </dl>
    )
  }
}
