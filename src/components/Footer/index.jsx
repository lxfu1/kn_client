import React from 'react'
import style from './style.scss'
import resource from 'util/resource'

class Footer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
    }
  }

  render() {
    return (
      <div className={style.footer}>
          <div className={style.center}>
              <p>技术支持：阿里云云计算（北京）有限责任公司</p>
              <p>（建议使用IE9以上版本进行浏览）</p>
          </div>
      </div>
    )
  }
}

export default Footer
