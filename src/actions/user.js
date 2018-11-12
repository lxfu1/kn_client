import resource from '../util/resource'
import { TOKEN, ROLES, USER } from 'constants/storage'
import { uploadImage } from './upload'

/**
 *
 * 认领企业
 * @param {Object} data
 */
function claimCompany(data) {
  return resource
    .post('/woodpecker-public/claimcompany/apply', data)
    .then(res => {
      if (res.status !== 200) {
        return Promise.reject(new Error(res.message))
      }
      return res
    })
    .catch(err => {
      if (err.response) {
        throw new Error(err.response.data.message)
      } else if (err instanceof Error) {
        throw err
      } else {
        throw new Error('提交失败')
      }
    })
}

/**
 * 获取已认领企业列表
 */
function getClaimCompanyList() {
  return resource.get('/woodpecker-public/claimcompany/list').catch(err => {
    if (err.response) {
      throw new Error(err.response.data.message)
    } else {
      throw new Error('出错了')
    }
  })
}

/**
 * 取消对企业的关注
 * @param {string} companyid
 */
function unFollow(companyid) {
  return resource
    .get('/woodpecker-public/attention/abolish?companyid=' + companyid)
    .catch(err => {
      if (err.response) {
        throw new Error(err.response.data.message)
      } else {
        throw new Error('出错了')
      }
    })
}

/**
 * 获取已关注企业列表
 */
function getFollowList() {
  return resource.get('/woodpecker-public/attention/list').catch(err => {
    if (err.response) {
      throw new Error(err.response.data.message)
    } else {
      throw new Error('出错了')
    }
  })
}

/**
 * 通过企业id来获取企业评分
 * @param {array} ids
 */
function getScoreByIds(ids) {
  return resource.post('/woodpecker-public/companyscore/scorelist', ids)
}

export {
  getScoreByIds,
  unFollow,
  getFollowList,
  getClaimCompanyList,
  claimCompany
}
