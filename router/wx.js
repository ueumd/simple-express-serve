/**
 * 微信公众号
 */
const express = require('express')
const axios = require('axios').default
const random = require('string-random')
const router = express.Router()

const config = require('../config')
const util = require('../utils')

const WX_BASE_URL = 'https://api.weixin.qq.com'

/**
 * 通过code换取网页授权access_token
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html#0
 */

const getAccessTokenByCode = async (code) => {
  const result = await axios.get(`/sns/oauth2/access_token?appid=${config.wx.appId}&secret=${config.wx.secret}&code=${code}&grant_type=authorization_code`, {
    baseURL: WX_BASE_URL
  })
  console.log('result: ', result)
  /**
   * {
   *   "access_token":"ACCESS_TOKEN",
   *   "expires_in":7200,
   *   "refresh_token":"REFRESH_TOKEN",
   *   "openid":"OPENID",
   *   "scope":"SCOPE",
   *   "is_snapshotuser": 1,
   *   "unionid": "UNIONID"
   * }
   */
  return result
}

/**
 * @description 获取微信用户信息 (需scope为 snsapi_userinfo)
 * @param {string} accessToken
 * @param {string} openid 用户openid
 *
 */
router.post('/getUserinfo', async (req, res) => {
  const code = req.body.code
  const { accessToken, openid } = await getAccessTokenByCode(code)

  const { data } = await axios.get(`/sns/userinfo?access_token=${accessToken}&openid=${openid}&lang=zh_CN`, { baseURL: WX_BASE_URL })
  res.send({
    data
  })
})

/**
 * 此Access token 和 code换取的token不一样，此token必须存在服务端
 * 获取Access token
 * 参考：https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html
 */
const getAccessToken = async () => {
  const result = await axios.get(`/cgi-bin/token?grant_type=client_credential&appid=${config.wx.appId}&secret=${config.wx.secret}`, { baseURL: WX_BASE_URL })
  console.log('getAccessToken: ', result.data, result.data.access_token)
  return result.data.access_token
}

/**
 * 获签名信息
 * @param {*} url - 要分享的网页链接
 *
 * 附录1-JS-SDK使用权限签名算法
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html
 * https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html
 */
router.post('/getSignature ', async (req, res) => {
  const url = req.body.url
  if (!url) return
  const accessToken = await getAccessToken()

  const getTicketResult = await axios.get(`/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`, { baseURL: WX_BASE_URL })

  console.log('jsapi_ticket: ', getticketResult.data)

  const jsapi_ticket = getTicketResult.data.ticket

  const nonceStr = random(16)
  const timestamp = new Date().getTime()
  const str = `jsapi_ticket=${jsapi_ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`
  const signature = util.generatorSha1(str)

  const result = {
    nonceStr,
    jsapi_ticket,
    timestamp,
    url,
    signature,
    appId: config.wx.appId
  }

  console.log('getSignature: ', result)
  res.send({
    data: result
  })
})

module.exports = router
