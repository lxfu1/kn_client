import React, {Component} from "react"
import Rodal from 'rodal'
import style from './style.scss'
import LoginModle from './subPage/loginModle'
import FindModle from './subPage/findModle'
import RegisterModle from './subPage/registerModle'
import ModifyModle from './subPage/modifyModle'
import RegSuccess from './subPage/regSuccess'
import FindSuccess from './subPage/findSuccess'
import NotMatch from './subPage/notMatch'

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            model: this.props.type || 'login',
            modifyData: '',
            height: this.getHeight(this.props.type || 'login')
        }
    }

    componentWillReceiveProps(props){
      if(props.type !== this.state.model){
        this.setState({
          model: props.type,
          height: this.getHeight(props.type || 'login')
        })
      }
    }

    getHeight = (type) =>{
      switch (type) {
        case 'login':
          return 430;
        case 'find':
          return 430;
        case 'register':
          return 510;
        case 'modify':
          return 400;
        case 'regSuccess':
          return 320;
        case 'findSuccess':
          return 320;
        case 'notMatch':
          return 540;
      }
    }

    setModle =()=>{
        switch (this.state.model) {
            case 'login':
              return <LoginModle changeModle={this.change} />;
            case 'find':
              return <FindModle changeModle={this.change}  />;
            case 'register':
              return <RegisterModle changeModle={this.change} />;
            case 'modify':
              return <ModifyModle changeModle={this.change} data={this.state.modifyData} />;
            case 'regSuccess':
              return <RegSuccess changeModle={this.change} />;
            case 'findSuccess':
              return <FindSuccess changeModle={this.change} />;
            case 'notMatch':
              return <NotMatch changeModle={() => {
                  this.props.cancel()
                }} />;
        }
    };

    change =(data, modifyData)=>{
        this.setState({
          model: data,
          modifyData: modifyData || '',
          height: this.getHeight(data || 'login')
        })
    };

    render() {
      let {cancel,show} = this.props;
        return (
          <Rodal width={400} height={this.state.height} visible={show} onClose={cancel}>
            <div className={style.loginBoxs}>
              {
                this.setModle()
              }
            </div>
          </Rodal>
        )
    }
}
