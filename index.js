var compose = require('../compose-middleware')
var fetch = require('node-fetch')
var requestToObject = require('./lib/request-to-object')
var fetchMiddleware = require('./lib/fetch-middleware')

var Fetchware = function (middleware) {
  var fetchware = function (input, init) {
    // normalize and clone by passing through Request constructor, then pull properties off of request instance because they are read-only
    var request = requestToObject(new fetch.Request(input, init))
    return compose(middleware.concat(fetchMiddleware))(request)
  }
  fetchware.use = function (fnOrArray) {
    return Fetchware(middleware.concat(fnOrArray))
  }
  return fetchware
}

var fetchware = Fetchware([])

module.exports = fetchware
