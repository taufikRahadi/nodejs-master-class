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

  },
  put: (data, callback) => {

  },
  delete: (data, callback) => {

  }
}

module.exports = handlers
