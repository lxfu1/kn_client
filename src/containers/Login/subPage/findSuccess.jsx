import React, {Component} from "react"
import style from '../style.scss'

export default class FindSuccess extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className={style.loginBox}>
        <div className={style.registerItem}>
          <div className={style.regSuccess}>
            <h5>找回成功</h5>
          </div>
          <button className={style.loginAction} onClick={()=>{this.props.changeModle('login')}}>返回登录</button>
        </div>
      </div>
    )
  }
}
