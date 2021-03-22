const crypto = require('crypto')
const config = require('../config')

const hash = (password) => {
  const hash = crypto
    .createHmac('sha256', config.hashSecret)
    .update(password)
    .digest('hex')
  
  return hash
}

module.exports = {
  hash
}
