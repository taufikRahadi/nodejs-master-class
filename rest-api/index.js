/*
* Primary for the API
*/

// Dependencies
const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const config = require('./config')

// the server should response to all request with a string
const server = http.createServer((req, res) => {

  // get the url and parse it
  const parsedUrl = url.parse(req.url, true)

  // get the url path
  const pathName = parsedUrl.pathname
  const trimmedPath = pathName.replace(/^\/+|\/+$/g, '')

  // get the query string
  const queryStringObject = parsedUrl.query

  // request method
  const methods = req.method.toLowerCase()

  // intercept request headers as an object
  const headers = req.headers
  console.log('request headers', headers)

  // get request body
  const decoder = new StringDecoder('utf-8')
  let buffer = ''
  req.on('data', (data) => {
    buffer += decoder.write(data)
    console.log('request body', buffer);
  })

  req.on('end', () => {
    buffer += decoder.end()

    // filter req path
    const handler = typeof(routers[trimmedPath]) !== 'undefined' ? routers[trimmedPath] : routers['not-found']
    const data = {
      trimmedPath,
      queryStringObject,
      methods,
      headers,
      payload: buffer
    }
    handler(data, (statusCode, payload) => {
      // use the status code called back by the handler, or use the default status code 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200

      // use the payload called back by the handler, or the default to an empty object
      payload = typeof(payload) == 'object' ? payload : {}

      // convert a payload to a string
      const payloadString = JSON.stringify(payload)

      // set content-type to application/json
      res.setHeader('Content-type', 'application/json')

      // set status code
      res.writeHead(statusCode)

      // log the response
      console.log('sending response', payloadString)

      // return the response
      res.end(payloadString)
    })
  
    // log the requested path
    console.log('request received on path : ' + trimmedPath)
  })

})

// start the server and listen on port 3000
server.listen(3000, () => console.log(`server is listening on port ${config.port} in ${config.envName.toUpperCase()} mode`))

// define routers
const routers = {
  'hello-world': ({ payload }, callback) => {
    payload = JSON.parse(payload)
    callback(200, { greet: `hello ${payload.name}`})
  },
  'not-found': (data, callback) => callback(404, { message: 'page not found :(' })
}