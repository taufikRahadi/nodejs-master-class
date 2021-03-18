/*
* Primary for the API
*/

// Dependencies
const http = require('http')
const https = require('https')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const config = require('./config')
const { readFileSync, readFile } = require('fs')
const _data = require('./lib/data')
const handlers = require('./lib/handlers')

// instantiate the http server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res)
})

// start the http server and listen
httpServer.listen(config.httpPort, () => console.log(`http server is listening on port ${config.httpPort}`))

// instantiate the https server
const httpsServerOptions = {
  'key': readFile('./https/key.pem', (err, data) => data),
  'cert': readFile('./https/cert.pem', (err, data) => data)
}
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res)
})

// start the https server and listen
httpsServer.listen(config.httpsPort, () => console.log(`https server is listening on port ${config.httpsPort}`))

// initiate empty object as routers
let routers = {
  'not-found': (_, callback) => callback(404, { message: 'page not found :(' })
}

// loop handlers and assign handlers key as routers object key
for (let k in handlers) {
  routers[k] = handlers[k]
}

// server logic
const unifiedServer = (req, res) => {
  // get the url and parse it
  const parsedUrl = url.parse(req.url, true)

  // get the url path
  const pathName = parsedUrl.pathname
  const trimmedPath = pathName.replace(/^\/+|\/+$/g, '')

  // log the requested path
  console.log('request received on path : ' + trimmedPath)

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
  
  })
}
