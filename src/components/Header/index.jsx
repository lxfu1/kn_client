import React from 'react';
import { NavLink, withRouter, Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { loginStore, personalStore } from '../../store/index';
import style from './style.scss';
import Password from '../../containers/password';

const NAV = [
    {
        name: '主页',
        to: '/main/home'
    },
    // {
    //     name: '空闲小写',
    //     to: '/main/article'
    // },
    {
        name: '发文',
        to: '/main/blog',
        need: true
    }
];

const NavItem = ({ name, to, need }, username) => {
    return (
        <NavLink
            to={to}
            className={style.navItem}
            activeClassName={style.navItemActive}
            key={name + to}
            style={{ display: need && !username ? 'none' : 'inline-block' }}
        >
            {name}
        </NavLink>
    );
};

@observer
class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            postSearchValue: '',
            mouser: 'none',
            showAlert: '',
            searchHistory: this.getHistory()
        };
    }

    componentDidMount() {
        loginStore.checkMember('mem');
        document.body.addEventListener('click', this.blurInput, false);
    }

    loginAction = (type, e) => {
        loginStore.toggleLogin(true, type);
    };

    loginOut = () => {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        loginStore.outUser();
        this.props.history.push('/');
    };

    getHistory = () => {
        let res = [];
        let history = localStorage.getItem('search');
        if (history) {
            res = JSON.parse(history);
        }
        return res;
    };

    searchValueChange = key => e => {
        this.setState({
            [key]: e.target.value
        });
    };

    onSearch = e => {
        e.stopPropagation();
        let { postSearchValue } = this.state;
        if (!postSearchValue) {
            return;
        }
        this.setHistory(postSearchValue);
        this.setState(
            {
                focus: false
            },
            () => {
                this.props.history.push(`/main/search/${postSearchValue}/文章`);
            }
        );
    };

    setHistory = keyword => {
        let history = JSON.parse(localStorage.getItem('search') || '[]');
        let exist = history.findIndex(item => item === keyword);
        if (exist === -1) {
            history.unshift(keyword);
        }
        history.splice(4, history.length - 4);

        localStorage.setItem('search', JSON.stringify(history));
    };

    clearHistory = (e, item) => {
        e.stopPropagation();
        let history = [];
        if (!item) {
            localStorage.setItem('search', '');
        } else {
            history = JSON.parse(localStorage.getItem('search') || '[]');
            let exist = history.findIndex(inner => inner === item);
            history.splice(exist, 1);
            localStorage.setItem('search', JSON.stringify(history));
        }
        this.setState({
            searchHistory: history
        });
    };

    focusInput = e => {
        e.stopPropagation();
        this.setState({
            focus: true,
            searchHistory: this.getHistory()
        });
    };

    blurInput = () => {
        this.setState({ focus: false });
    };

    componentWillUnmount() {
        document.body.removeEventListener('click', this.blurInput, false);
    }

    handleMouseMove = () => {
        this.setState({
            mouser: 'block'
        });
    };

    handleMouseOut = () => {
        this.setState({
            mouser: 'none'
        });
    };

    handleModal = () => {
        let state = this.state;

        state.showAlert = (
            <Password status={true} handleCancel={this.handleCancel} />
        );
        this.setState(state);
    };

    handleCancel = e => {
        let state = this.state;

        state.showAlert = '';
        this.setState(state);
    };

    render() {
        const { searchHistory, focus, mouser, showAlert } = this.state;

        return (
            <div className={style.header}>
                <span className={style.icon}>1·</span>
                <div className={style.navBox}>
                    <div className={style.navList}>
                        {NAV.map(obj => {
                            return NavItem(obj, loginStore.userName);
                        })}
                        <div
                            className={style.postSearchInput}
                            onClick={this.focusInput}
                        >
                            <input
                                type="text"
                                value={this.state.postSearchValue}
                                onChange={this.searchValueChange(
                                    'postSearchValue'
                                )}
                                placeholder="请输入文章标题"
                            />
                            <img
                                src={require('./sh.png')}
                                onClick={this.onSearch}
                            />
                            <div
                                className={style.history}
                                style={{
                                    display:
                                        focus && searchHistory.length > 0
                                            ? 'block'
                                            : 'none'
                                }}
                            >
                                <div>
                                    <div className={style.flexColumn}>
                                        {searchHistory.map(item => {
                                            return (
                                                <div
                                                    className={style.flexRow}
                                                    key={item}
                                                >
                                                    <Link
                                                        to={`/main/search/${item}/文章`}
                                                        target="_blank"
                                                    >
                                                        <span>
                                                            <i className="icon iconfont">
                                                                &#xe632;
                                                            </i>
                                                            {item}
                                                        </span>
                                                    </Link>
                                                    <i
                                                        onClick={e => {
                                                            this.clearHistory(
                                                                e,
                                                                item
                                                            );
                                                        }}
                                                    >
                                                        x
                                                    </i>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {loginStore.userName ? (
                        <div
                            className={style.loginInfo}
                            onMouseMove={this.handleMouseMove}
                            onMouseOut={this.handleMouseOut}
                        >
                            <i className="icon iconfont">&#xe688;</i>
                            <label>{loginStore.userName}</label>
                            <label className={style.split}>/</label>
                            <label onClick={this.loginOut}>退出</label>
                        </div>
                    ) : (
                        <div className={style.loginInfo}>
                            <i className="icon iconfont">&#xe688;</i>
                            <label
                                onClick={e => {
                                    this.loginAction('login', e);
                                }}
                            >
                                登录
                            </label>
                            <label className={style.split}>/</label>
                            <label
                                onClick={e => {
                                    this.loginAction('register', e);
                                }}
                            >
                                注册
                            </label>
                        </div>
                    )}
                </div>
                <div className={style.outhover}>
                    <ul
                        className={style.lists}
                        style={{ display: mouser }}
                        onMouseMove={this.handleMouseMove}
                        onMouseOut={this.handleMouseOut}
                    >
                        <li>
                            <Link to="/main/personal">个人中心</Link>
                        </li>
                        <li onClick={this.handleModal}>密码修改</li>
                    </ul>
                </div>
                {showAlert}
            </div>
        );
    }
}

export default withRouter(Header);
