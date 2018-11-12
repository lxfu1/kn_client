import React, { Component } from 'react'
import moment from 'moment'
import AppRightBar from 'components/AppRightBar'
import PostItem from 'components/PostItem'
import List from './subpage/list'
import resource from 'util/resource'
import styles from './styles.scss'

class Article extends Component {

  render() {
    return (
        <div className={styles.container}>
            <List />
            <AppRightBar
                getHotRedirect={this.getHotRedirect}
            />
        </div>
    )
  }
}

export default Article
