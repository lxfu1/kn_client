import React, { Component } from 'react'
import Header from 'components/Header'
import style from './style.scss'
import { Layout, Menu, Breadcrumb, Icon } from 'antd'
import { NavLink, hashHistory } from 'react-router'

const { Content, Sider } = Layout
const SubMenu = Menu.SubMenu

export default class AdminSystem extends Component {
  state = {
    navLink: '/admin/article'
  }

  linkTo = ({ key }) => {
    this.props.history.push(key)
    this.setState({
      navLink: key
    })
  }

  render() {
    return (
      <div className={style.adminPag}>
        <div>
          <Header />
        </div>
        <Layout style={{ minHeight: 'calc(100vh - 60px)' }}>
          <Sider width={240} style={{ background: '#fff' }}>
            <div className="logo" />
            <Menu
              theme="blue"
              mode="inline"
              selectedKeys={[this.state.navLink]}
              onClick={this.linkTo}
            >
              <Menu.Item key="/admin/article">
                <Icon type="form" />
                <span>article</span>
              </Menu.Item>
              <Menu.Item key="/admin/user">
                <Icon type="user" />
                <span>User</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout> {this.props.children}</Layout>
        </Layout>
      </div>
    )
  }
}
