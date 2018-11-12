import React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import { observable, runInAction } from 'mobx'
import { observer } from 'mobx-react'
import resource from 'util/resource'
import { withRouter, Link } from 'react-router-dom'
import qs from 'qs'
import styles from './index.scss'
import moment from 'moment'

const Box = ({ icon, title, children }) => (
    <div className={styles.box}>
        <div className={styles.header}>
            <span>{title}</span>
        </div>
        <div className={styles.boxContainer}>{children}</div>
    </div>
)

Box.propTypes = {
    icon: PropTypes.any,
    title: PropTypes.any,
    children: PropTypes.any
}

class AppRightBar extends React.Component {
    state = {
        hots: []
    }

    componentDidMount() {
        this.requestHotList()
    }

    requestHotList = () => {
        resource .get(`/kn/articleTopFive`)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        hots: res.data.rows || []
                    })
                }
            })
    }

    render() {
        const {hots} = this.state
        return (
            <div className={styles.container}>
                <Box title="大家都在看">
                    <div className={styles.hotLists}>
                        {hots.map((v, index) => {

                            return <Link
                                key={v.articleId}
                                className={cls(styles.hotList, {
                                        [styles.one]: index === 0,
                                        [styles.tow]: index === 1
                                      })}
                                to={`/main/detail/${v.articleId}`}
                                target="_blank"
                            >
                                {v.title}
                                {index === 0 && <img src={require('./images/hot.png')}/>}
                                {index === 1 && <img src={require('./images/hot2.png')}/>}
                            </Link>
                        })}
                    </div>
                </Box>
            </div>
        )
    }
}

export default withRouter(AppRightBar)
