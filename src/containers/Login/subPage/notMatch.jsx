import React, {Component} from "react"
import style from './notMatch.scss'
import { loginStore } from '../../../store'

export default class NotMatch extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className={style.content}>
        <img src={require('../images/fail_icon.png')} />
        <span className={style.message}>{loginStore.message}</span>
        <div style={{marginTop: '40px'}}>
          <p>
            <span className={style.spanlabel}>服务电话：</span>
            <span>0754-88658082</span>
          </p>
          <p>
            <span className={style.spanlabel}>服务时间：</span>
            <span>周一到周五，上午9点到12点，下午2点到6点</span>
          </p>
        </div>
        <button onClick={() => {
            this.props.changeModle();
          }} className={style.ok}>
          确定
        </button>
      </div>
    )
  }
}
