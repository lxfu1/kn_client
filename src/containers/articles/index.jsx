import React, { Component } from 'react';
import AppRightBar from 'components/AppRightBar';
import List from './subpage/list';
import styles from './style.scss';

class Article extends Component {
    render() {
        return (
            <div className={styles.container}>
                <List />
                <AppRightBar getHotRedirect={this.getHotRedirect} />
            </div>
        );
    }
}

export default Article;
