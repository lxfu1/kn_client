// yzsexe 2017/12/14  政策法规
import React, { Component } from 'react'
import Banner from 'static/images/banner.png'
import resource from 'util/resource'
import moment from 'moment'
import CrumbsNav from 'components/CrumbsNav'
import AppRightBar from 'components/AppRightBar'
import Loading from 'components/Loading'
import NoData from 'components/noData'
import styles from './styles.scss'

const links = [
  {
    name: '信用动态',
    uri: '/main/creditDynamics'
  },
  {
    name: '信用公示',
    uri: '/main/creditPublicity'
  },
  {
    name: '联合奖惩',
    uri: '/main/rewardsPunishments'
  },
  {
    name: '信用应用',
    uri: '/main/tradeCredit'
  }
]

class Detail extends Component {
  constructor(props) {
    super(props)
    this.data3 = []
    this.state = {
      ori_content: '',
      data: '',
      loading: true
    }
  }

  componentDidUpdate() {}

  componentDidMount() {
    const { id, columnName } = this.props.match.params
    this.detailRequire(id, columnName)

    this.setState({
      columnName: columnName
    })
  }

  componentWillReceiveProps(nextProps) {
    const { id, columnName } = nextProps
    this.detailRequire(id, columnName)

    this.setState({
      columnName: columnName
    })
  }

  handleCut = content => {
    if (!content) {
      return '--'
    }
    if (content.length > 20) {
      return `${content.substring(0, 20)}...`
    }
    return content
  }

  detailRequire = (id, columnName) => {
    this.setState({
      loading: true
    })

    let url = encodeURI(
      columnName === '联合奖惩政策'
        ? `/shantoucredit_pubserver/front/article/getone?id=${id}&model=${columnName}`
        : `/shantoucredit_pubserver/front/article/getone?id=${id}`
    )

    resource
      .get(url)
      .then(res => {
        if (res.code === 200) {
          this.setState({
            data: res.data,
            ori_content: res.data.ori_content,
            loading: false
          })
        } else {
          this.setState({
            loading: false
          })
        }
      })
      .catch(err => {
        console.info(err)
        this.setState({
          loading: false
        })
      })
  }

  getHotRedirect = (data, path) => ({
    type: 0,
    url:
      path.replace('/:id', '').replace(':columnName', data.col) + '/' + data.id
  })

  render() {
    const data = this.state.data
    const { columnName } = this.state
    const navLinks = [
      {
        to: this.props.parentPath || this.props.page,
        arrow: true,
        name: this.props.name
      },
      {
        to: `${this.props.page}/${this.props.match.params.columnName}`,
        arrow: true,
        name: this.props.match.params.columnName
      },
      {
        to: this.props.match.url,
        arrow: false,
        name: `${this.props.match.params.columnName}详情`
      }
    ]

    return (
      <div>
        <CrumbsNav link={navLinks} />
        <div className={styles.detailContainer}>
          <div className={styles.bannerBox}>
            <img src={Banner} />
          </div>
          <div className={styles.contentBox}>
            {this.state.data ? (
              <div className={styles.LeftBox}>
                <div className={styles.titleBox}>
                  <h1>{data.title}</h1>
                </div>
                <div className={styles.sourceBox}>
                  {columnName === '联合奖惩政策' ? null : (
                    <span title={data.source}>
                      来源：{this.handleCut(data.source)}
                    </span>
                  )}
                  <span>
                    日期：{data.publishtime
                      ? moment(parseInt(data.publishtime, 10)).format(
                          'YYYY-MM-DD'
                        )
                      : '--'}
                  </span>
                </div>
                <div
                  className={styles.oriBox}
                  dangerouslySetInnerHTML={{ __html: this.state.ori_content }}
                />
              </div>
            ) : this.state.loading ? (
              <div className={styles.LeftBox}>
                <Loading />
              </div>
            ) : (
              <div className={styles.LeftBox}>
                <NoData />
              </div>
            )}
            <AppRightBar
              links={links}
              name={this.props.name}
              getHotRedirect={this.getHotRedirect}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Detail
