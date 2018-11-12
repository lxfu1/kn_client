// yzsexe 2017/12/14   信用动态、政策法规、专项治理、行业信用-左侧公用
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Pagination from 'rc-pagination'
import Logo from './images/company.png'
import styles from './styles.scss'

class TableList extends Component {
  static propTypes = {
    titles: PropTypes.array.isRequired,
    data: PropTypes.array,
    size: PropTypes.number,
    current: PropTypes.number,
    total: PropTypes.number,
    listChange: PropTypes.func,
    pageChange: PropTypes.func,
    handleTitle: PropTypes.func,
    detailPath: PropTypes.string,
    // 组件定制配置
    iconShow: PropTypes.bool,
    iconInner: PropTypes.string,
    sourceShow: PropTypes.bool,
    type: PropTypes.string,
    titleOnly: PropTypes.bool,
    btnShow: PropTypes.bool,
    toLink: PropTypes.bool,
    defaultTitle: PropTypes.string
  }
  static defaultProps = {
    defaultTitle: '',
    titles: [],
    data: [],
    size: 7,
    current: 1,
    total: 7,
    detailPath: '',
    // 组件定制配置
    iconShow: true, // 标题红色icon(是否显示)
    iconInner: '来源', // 来源地span内容
    sourceShow: true, // 来源地span(是否显示)
    type: 'default', // 列表类型(default/logo)
    titleOnly: false, // 是否只显示标题
    btnShow: false, // 我要承诺按钮(是否显示)
    toLink: false // 文章列表标题跳转(是否跳转)
  }
  constructor(props) {
    super(props)
    const idx = this.props.titles.indexOf(this.props.defaultTitle)
    this.state = {
      titleIndex: idx === -1 ? 0 : idx
    }
  }

  // 切换栏目，加载对应内容
  handleTitle = (index, value) => {
    this.setState(
      {
        titleIndex: index
      },
      () => {
        this.props.listChange(value)
      }
    )
  }
  // 列表超出点点点
  handleCut = abstract => {
    if (abstract.length > 140) {
      return `${abstract.substring(0, 140)}...`
    }
    return abstract
  }

  pageChange = page => {
    this.props.pageChange(page)
  }

  render() {
    const sourceIcon = this.props.iconShow ? (
      <span className={styles.sourceIcon}>
        {this.props.iconInner ? this.props.iconInner : '来源'}
      </span>
    ) : null

    const commitBtn = this.props.btnShow ? (
      <span className={styles.promiseBtn}>我要承诺</span>
    ) : null

    return (
      <div className={styles.LeftBox}>
        <div className={styles.TableListContainer}>
          <div className={styles.titleBox}>
            {this.props.titles.map((ite, index) => (
              <span
                key={index}
                value={ite}
                className={
                  styles.titleItem +
                  ' ' +
                  styles[this.state.titleIndex === index ? 'active' : '']
                }
                onClick={() => {
                  this.handleTitle(index, ite)
                }}
              >
                {ite}
              </span>
            ))}
            {commitBtn}
          </div>
          <div className={styles.listBox}>
            {this.props.data.length > 0 &&
              this.props.data.map((ite, index) => (
                <figure key={index} className={styles.listItem}>
                  <figcaption className={styles.itemCaption}>
                    <Link
                      to={`${this.props.detailPath}/${ite.id}`}
                      title={ite.title}
                      className={styles.captionItem + ' ' + 'text-overflow'}
                      // onClick={() => {
                      //   this.handleDetail(ite)
                      // }}
                    >
                      {ite.title}
                    </Link>
                    <span className={styles.sourceBox}>
                      {sourceIcon}
                      <span className={styles.sourceItem}>{ite.source}</span>
                      <span className={styles.sourceTime}>
                        {moment(parseInt(ite.publishtime, 10)).format(
                          'YYYY-MM-DD'
                        )}
                      </span>
                    </span>
                  </figcaption>
                  <figcaption className={styles.itemContent}>
                    {this.handleCut(ite.abstract)}
                  </figcaption>
                </figure>
              ))}
          </div>
          <div className={styles.footerPagination}>
            {this.props.data.length ? (
              <Pagination
                pageSize={this.props.size}
                current={this.props.current}
                total={this.props.total}
                onChange={this.pageChange}
                showQuickJumper
              />
            ) : null}
          </div>
        </div>
      </div>
    )
  }
}

export default TableList
