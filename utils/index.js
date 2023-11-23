const crypto = require('crypto-js')

module.exports = {
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },
  uuidV4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  },
  generatorSha1(str) {
    return crypto.SHA1(str).toString(crypto.enc.Hex)
  }
}
