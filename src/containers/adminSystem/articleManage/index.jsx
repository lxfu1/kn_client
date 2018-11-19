import React, { Component } from 'react'
import style from './style.scss'
import resource from 'util/resource'
import { Input, Table, Modal, message } from 'antd'

const Search = Input.Search
const confirm = Modal.confirm

export default class ArticleManage extends Component {
  state = {
    page: 1,
    title: '',
    listSort: 'desc',
    total: 0,
    listData: []
  }
  componentDidMount() {
    this.getArctilesList()
  }

  getArctilesList = () => {
    const state = this.state
    const params = {
      page: state.page,
      size: 10,
      title: state.title,
      sortMehod: state.listSort
    }

    resource.get('/kn/articleListAdmin', params).then(res => {
      if (res.status === 200) {
        let _data = res.data
        this.setState({
          total: _data.count,
          listData: _data.rows
        })
      }
    })
  }

  deleteOne = record => {
    confirm({
      style: { top: '300' },
      title: '确认删除此条文章?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        resource
          .delete(`/kn/deleteArticleAdmin/${record.articleId}`)
          .then(res => {
            if (res.status === 200) {
              message.success('删除成功')
            } else {
              throw new Error('删除失败')
            }
          })
          .catch(err => message.error(err))
      },
      onCancel() {}
    })
  }

  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: '',
        key: 'index',
        align: 'center',
        render: (text, record, index) => {
          return index + 1
        }
      },
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        className: style.title,
        onCell: record => {
          return {
            onClick: () => {
              this.props.history.push(`/main/detail/${record.articleId}`)
            }
          }
        }
      },
      {
        title: '作者',
        align: 'center',
        dataIndex: 'user.username',
        key: 'user'
      },
      {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime'
      },
      {
        title: '操作',
        key: 'user_operation',
        dataIndex: '',
        align: 'center',
        className: style.operation,
        render: record => {
          return (
            <div>
              <span
                onClick={() =>
                  this.props.history.push(
                    `/admin/article/edit/${record.articleId}`
                  )
                }
              >
                编辑
              </span>
              <span onClick={() => this.deleteOne(record)}>删除</span>
            </div>
          )
        }
      }
    ]

    return (
      <div className={style.container}>
        <div className={style.Search}>
          <Search
            placeholder="请输入文章标题"
            size="large"
            onSearch={val => {
              this.setState(
                {
                  title: val
                },
                this.getArctilesList
              )
            }}
            enterButton
          />
        </div>
        <div>
          <Table
            rowKey={record => record.articleId}
            columns={columns}
            dataSource={this.state.listData}
          />
        </div>
      </div>
    )
  }
}
