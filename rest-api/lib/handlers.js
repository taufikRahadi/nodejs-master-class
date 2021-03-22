// dependencies
const { isString, isNotEmpty, minLength, isBoolean } = require('./validation')
const { read, create } = require('./data')
const { hash } = require('./helpers')

let handlers = {
  'hello': ({ payload }, callback) => {
    payload = JSON.parse(payload)
    callback(200, { greet: `hello ${payload.name}`})
  },
  'ping': (_, callback) => {
    callback(200)
  },
  'users': (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete']
    if (!acceptableMethods.some(method => method === data.methods)) callback(404, 'page with requested method was not found :(')

    _users[data.methods](data, callback)
  }
}

const _users = {
  get: (data, callback) => {

  },
  post: (data, callback) => {
    const firstName = isString(data.payload.firstName) && isNotEmpty(data.payload.firstName) ? data.payload.firstName : false
    const lastName = isString(data.payload.lastName) ? data.payload.lastName : false
    const phone = minLength(10, data.payload.phone) && isString(data.payload.phone) ? data.payload.phone : false
    const password = isString(data.payload.password) && minLength(8, data.payload.password) ? data.payload.password : false
    const tosAgreement = isBoolean(data.payload.tosAgreement) && data.payload.tosAgreement ? true : false

    if (firstName && lastName && phone && password && tosAgreement) {
      // check if user is exists
      read('/users', `${phone}.json`, (err, data) => {
        if (err) callback(400, { success: false, message: 'user already exists' })

        else {
          create(
            '/users', 
            `${phone}.json`,
            {
            firstName, lastName, phone, password: hash(password), tosAgreement
          }, callback())
        }
      })
    } else {

    }
  },
  put: (data, callback) => {

  },
  delete: (data, callback) => {

  }
}

module.exports = handlers
