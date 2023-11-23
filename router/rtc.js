/**
 * 声网API
 */

const express = require('express')
const router = express.Router()
const axios = require('axios').default

const config = require('../config')
const utils = require('../utils')

let taskId = 0

function getAuth() {
  const customerKey = config.rtc.key
  const customerSecret = config.rtc.secret
  const plainCredential = customerKey + ':' + customerSecret
  encodedCredential = Buffer.from(plainCredential).toString('base64')
  authorizationField = 'Basic ' + encodedCredential
  return authorizationField
}

router.get('/hello', (req, res) => {
  res.send({
    data: Date.now()
  })
})

router.get('/create', async (req, res) => {
  const options = {
    method: 'POST',
    url: `https://api.sd-rtn.com/cn/v1/projects/${config.rtc.appId}/cloud-player/players`,
    headers: {
      Authorization: getAuth(),
      Accept: 'application/json',
      'X-Request-ID': utils.uuidV4(),
      'Content-Type': 'application/json'
    },
    data: {
      player: {
        audioOptions: { profile: 1 },
        videoOptions: {
          width: 1920,
          height: 1080,
          frameRate: 15,
          bitrate: 400,
          codec: 'H.264',
          gop: 30,
          fillMode: 'fill'
        },
        streamUrl: config.rtc.streamUrl,
        channelName: config.rtc.channelName,
        token: config.rtc.token,
        uid: 101,
        idleTimeout: 300,
        playTs: 0,
        name: 'test',
        repeatTime: -1
      }
    }
  }

  try {
    const response = await axios.request(options)
    if (response.status === 200) {
      taskId = response.data.player.id
      res.send({
        data: response.data
      })
    }
  } catch (error) {
    res.send({
      code: error.response.status,
      message: error.response.data
    })

    console.error(error)
  }
})

router.get('/delete/:id', async (req, res) => {
  const id = taskId || req.params.id
  console.log('id: ', id)

  const options = {
    headers: {
      Authorization: getAuth(),
      Accept: 'application/json',
      'X-Request-ID': utils.uuidV4(),
      'Content-Type': 'application/json'
    }
  }

  try {
    const response = await axios.delete(`https://api.sd-rtn.com/cn/v1/projects/${config.rtc.appId}/cloud-player/players/${id}`, options)
    if (response.status === 200) {
      res.send({
        data: response.data
      })
    }
  } catch (error) {
    res.send({
      code: error.response.status,
      message: error.response.data
    })

    console.error(error)
  }
})

module.exports = router
