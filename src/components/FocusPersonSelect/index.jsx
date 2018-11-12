import React, { Component } from 'react'
import style from './style.scss'
import resource from 'util/resource'

class FocusPersonSelect extends Component {
  constructor(props) {
    super(props)

    const { type, city } = this.props.selectParams || {}

    this.state = {
      topNav: [],
      searchRange: ['汕头市', '广东省'],
      topItem: '查找范围',
      checkedArea: city || '汕头市',
      checkedJob: type || '会计从业资格证信息',
      jobs_shantou: [
        '会计从业资格证信息',
        '司法鉴定人执业信息',
        '统计从业资格信息',
        '造价工程师执业资格注册信息',
        '建造师执业资格注册信息',
        '特种设备作业人员证书',
        '护士执业资格证信息',
        '药学技术人员备案信息',
        '律师信息',
        '医师执业证书信息'
      ],
      jobs_gd: []
    }
  }

  componentDidMount() {
    resource.get('/shantoucredit_pubserver/dataService/getTypeid').then(res => {
      if (res.status === 200) {
        let data = res.data.filter(item => item.typename !== '企业高管')

        this.setState({
          gdData: data,
          firstItemId: data[0].typeid,
          jobs_gd: data.map(item => item.typename)
        })
      }
    })

    document.addEventListener('click', this.close, false)
  }

  componentWillReceiveProps({ displayJob, selectParams }) {
    if (this.state.moduleName === displayJob) return

    this.setState({
      topNav:
        displayJob === '重点人群' ? ['查找范围', '职业类别'] : ['查找范围'],
      topItem: displayJob === '重点人群' ? this.state.topItem : '查找范围',
      checkedArea:
        JSON.stringify(selectParams) !== '{}' && selectParams
          ? selectParams.city
          : '汕头市',
      moduleName: displayJob,
      selectId:
        JSON.stringify(selectParams) !== '{}' && selectParams
          ? selectParams.typeId
          : ''
    })
  }

  close = () => {
    if (this.props.view) {
      this.props.displayJob === '重点人群'
        ? this.props.callText(this.state.checkedArea, this.state.checkedJob)
        : this.props.callText(this.state.checkedArea)
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.close)
  }

  handleTop = name => e => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()

    this.setState({
      topItem: name
    })
  }

  handleBottom = value => e => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()

    if (this.state.topItem === '查找范围') {
      this.setState({
        checkedArea: value,
        checkedJob:
          value === '汕头市' ? '会计从业资格证信息' : this.state.jobs_gd[0],
        selectId: value === '汕头市' ? '' : this.state.firstItemId
      })
    } else {
      let selectId = ''

      if (this.state.checkedArea !== '汕头市') {
        this.state.gdData.map(item => {
          if (item.typename === value) {
            selectId = item.typeid
          }
        })
      }

      this.setState({
        checkedJob: value,
        selectId: selectId
      })
    }
  }

  renderBottomItems = () => {
    const { topItem, checkedArea, checkedJob } = this.state
    let itemsData = []
    let activeItem = ''

    if (topItem === '查找范围') {
      itemsData = this.state.searchRange
      activeItem = checkedArea
    } else {
      itemsData =
        checkedArea === '汕头市' ? this.state.jobs_shantou : this.state.jobs_gd

      activeItem = checkedJob
    }

    return (
      <div>
        {itemsData.map((item, key) => (
          <span
            key={key}
            className={item === activeItem ? style.checked : ''}
            onClick={this.handleBottom(item)}
          >
            {item}
          </span>
        ))}
      </div>
    )
  }

  render() {
    const { topItem } = this.state

    return (
      <div
        className={style.focus_select}
        style={{
          display: this.props.view ? 'block' : 'none',
          ...this.props.sty
        }}
      >
        <div className={style.area}>
          {this.state.topNav.map((item, key) => (
            <span
              className={topItem === item ? style.checked : ''}
              key={key}
              onClick={this.handleTop(item)}
            >
              {item}
            </span>
          ))}
          <a style={{ left: topItem === '查找范围' ? '0' : '80px' }} />
        </div>
        <hr />
        {this.renderBottomItems()}
      </div>
    )
  }
}

export default FocusPersonSelect
