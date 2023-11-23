const express = require('express')
const router = express.Router()
const request = require('request-promise')

router.get('/', (req, res) => {
  res.send({
    data: Date.now()
  })
})

router.get('/list', async (req, res) => {
  const result = await request({
    method: 'GET',
    uri: 'http://jsonplaceholder.typicode.com/posts'
  })
  res.send({
    data: JSON.parse(result)
  })
})

router.get('/list/:id', async (req, res) => {
  console.log('id: ', req.params.id)

  const response = await request({
    method: 'GET',
    uri: `http://jsonplaceholder.typicode.com/posts/${req.params.id}`
  })

  res.send({
    data: JSON.parse(response)
  })
})

router.get('/list/:id', async (req, res) => {
  console.log('id: ', req.params.id)

  const response = await request({
    method: 'GET',
    uri: `http://jsonplaceholder.typicode.com/posts/${req.params.id}`
  })

  res.send({
    data: JSON.parse(response)
  })
})

module.exports = router
