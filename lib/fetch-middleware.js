var fetch = require('node-fetch')

var fetchMiddleware = function (request) {
  return fetch(request.url, request.init).then(function (response) {
    return { request: request, response: response }
  })
}

module.exports = fetchMiddleware
