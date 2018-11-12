import React from 'react'
import { NavLink, withRouter} from 'react-router-dom'
import { observer } from 'mobx-react';
import {loginStore, personalStore} from '../../store/index';
import style from './style.scss'

const NAV = [
    {
        name: '主页',
        to: '/main/home'
    },
    {
        name: '空闲小写',
        to: '/main/article'
    },
    {
        name: 'Blog',
        to: '/main/blog'
    }
];

const NavItem = ({ name, to }) => {
    return (
        <NavLink
            to={to}
            className={style.navItem}
            activeClassName={style.navItemActive}
            key={name + to}
        >
            {name}
        </NavLink>
    )
}

@observer
class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false,
            postSearchValue: ""
        }
    }

    loginAction = (type, e) =>{
        loginStore.toggleLogin(true, type);
    }

    loginOut = () => {
        sessionStorage.removeItem('user');
        loginStore.outUser();
        /*if (personalStore.pushHome() === 'home') {
            this.props.history.push('/')
        }*/
    }

    searchValueChange = key => e => {
        this.setState({
            [key]: e.target.value
        })
    }

    onSearch = e => {
        if (e) {
            e.preventDefault()
        }
        let {postSearchValue} = this.state;
        if(!postSearchValue){
            return;
        }
        this.setHistory(postSearchValue);
        this.props.history.push(`/main/search/${postSearchValue}/文章`)
    }

    setHistory = (keyword) => {
        let history = JSON.parse(localStorage.getItem('search') || '[]');
        let exist = history.findIndex(item => item === keyword);
        if(exist === -1){
            history.unshift(keyword);
        }
        history.splice(4, history.length - 4);

        localStorage.setItem('search', JSON.stringify(history))
    }

    render() {
        return (
            <div className={style.header}>
                <span className={style.icon}>1·</span>
                <div className={style.navBox}>
                    <div className={style.navList}>
                        {NAV.map(obj => {
                            return NavItem(obj)
                        })}
                        <div className={style.postSearchInput}>
                            <input
                                type="text"
                                value={this.state.postSearchValue}
                                onChange={this.searchValueChange('postSearchValue')}
                                placeholder="请输入文章标题"
                            />
                            <img
                                src={require('./find2.png')}
                                onClick={this.onSearch}
                            />
                        </div>
                    </div>
                    {
                        loginStore.userName ? <div className={style.loginInfo}>
                            <i className="icon iconfont">&#xe688;</i>
                            <label>
                                {
                                    loginStore.userName
                                }
                            </label>
                            <label className={style.split}>
                                /
                            </label>
                            <label onClick={this.loginOut}>
                                退出
                            </label>
                          </div> : <div className={style.loginInfo}>
                            <i className="icon iconfont">&#xe688;</i>
                            <label onClick={(e)=>{this.loginAction('login',e)}}>
                                登录
                            </label>
                            <label className={style.split}>
                                /
                            </label>
                            <label onClick={(e)=>{this.loginAction('register',e)}}>
                                注册
                            </label>
                          </div>
                    }
                </div>
            </div>
        )
    }
}

export default withRouter(Header);
