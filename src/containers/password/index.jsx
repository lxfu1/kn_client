import React, { Component } from 'react'
import style from './style.scss'
import resource from 'util/resource'
import { Modal } from 'antd'

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.time = null
    this.state = {
      visible: this.props.status,
      oldPassword: '',
      newPassword: '',
      surePassword: '',
      messages: ''
    }
  }

  handleOk = () => {
    let { oldPassword, newPassword, surePassword } = this.state
    if (oldPassword && newPassword && surePassword) {
      if (newPassword === surePassword) {
        resource
          .post('/kn/modifyPassword', { oldPassword, newPassword })
          .then(res => {
            if (res.status === 200) {
              this.setState({}, () => this.handleCancel())
            } else {
              this.setState({ messages: res.message })
            }
          })
      } else {
        this.setState({
          messages: '新密码和确认密码不一致！'
        })
      }
    } else {
      this.setState({
        messages: '请完整填写内容！'
      })
    }
  }

  handleCancel = e => {
    if (this.props.handleCancel) {
      this.props.handleCancel()
    }
  }

  inputChange = (e, name) => {
    this.setState({
      [name]: e.target.value
    })
  }

  render() {
    let { oldPassword, newPassword, surePassword, messages } = this.state
    return (
      <Modal
        visible={true}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={null}
        width="400px"
      >
        <div className={style.content}>
          <h1 className={style.title}>密码修改</h1>
          <div>
            <input
              type="password"
              placeholder="原始密码"
              value={oldPassword}
              onChange={event => this.inputChange(event, 'oldPassword')}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="新密码"
              value={newPassword}
              onChange={event => this.inputChange(event, 'newPassword')}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="确认密码"
              value={surePassword}
              onChange={event => this.inputChange(event, 'surePassword')}
            />
          </div>
          <div style={{ color: 'red' }}>{messages}</div>
          <div className={style.btns}>
            <button onClick={this.handleCancel}>取消</button>
            <button onClick={this.handleOk}>确认</button>
          </div>
        </div>
      </Modal>
    )
  }
}
