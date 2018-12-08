import React from 'react';
import { NavLink, withRouter, Link } from 'react-router-dom';
import moment from 'moment';
import style from './style.scss';

class ListIcons extends React.Component {
    render() {
        const { item, needDelete } = this.props;
        return (
            <div className={style.icons}>
                <span>
                    <i className="icon iconfont">&#xe688;</i>
                    <Link
                        to={
                            needDelete
                                ? '#'
                                : `/main/personal/${item.user.userId}`
                        }
                        target="_blank"
                    >
                        {item.user.username || item.author || '-'}
                    </Link>
                </span>
                <span>
                    <i className="icon iconfont">&#xe722;</i>
                    <label>{item.scans || 0}</label>
                </span>
                <span>
                    <i className="icon iconfont">&#xe603;</i>
                    <label>{item.comments || 0}</label>
                </span>
                <span>
                    <i className="icon iconfont">&#xe632;</i>
                    <label>
                        {moment(item.updateTime).format(
                            'YYYY-MM-DD hh:mm:ss a'
                        )}
                    </label>
                </span>
                {needDelete ? (
                    <span
                        className={style.delete}
                        onClick={() => {
                            this.props.delete(item.articleId);
                        }}
                    >
                        删除
                    </span>
                ) : null}
            </div>
        );
    }
}

export default withRouter(ListIcons);
