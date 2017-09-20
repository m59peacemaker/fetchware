var test = require('tape')
var { Request } = require('node-fetch')
var fetchware = require('../')
var { URL } = require('./index.test')

function append (v) {
  return function (request, next) {
    request.url = request.url + v
    return next(request)
  }
}

function type (t) {
  return function (request, next) {
    return next(request).then(result => result.response[t]())
  }
}

function reqSet (prop, v) {
  return function (request, next) {
    request.init[prop] = v
    return next(request)
  }
}

test('middleware modifies request', function (t) {
  t.test('string url and init object', function (t) {
    t.plan(2)

    fetchware
      .use(append('/1'))
      (URL + 'posts')
      .then(function (result) { return result.response.json() })
      .then(function (body) { t.equal(body.id, 1, 'modified the url') })

    fetchware
      .use(append('posts'))
      .use(reqSet('method', 'post'))
      .use(reqSet('body', JSON.stringify({
        title: 'hey'
      })))
      // content type header required for jsonplaceholder server to reply like we want
      (URL, { headers: { 'Content-Type': 'application/json' } })
      .then(function (result) { return result.response.json() })
      .then(function (body) { t.equal(body.title, 'hey') })
  })

  t.test('Request object', function (t) {
    t.plan(2)

    fetchware
      .use(append('/1'))
      (new Request(URL + 'posts'))
      .then(function (result) { return result.response.json() })
      .then(function (body) { t.equal(body.id, 1, 'modified the url') })

    fetchware
      .use(append('posts'))
      .use(reqSet('method', 'POST'))
      .use(reqSet('body', JSON.stringify({
        title: 'hey'
      })))
      (new Request(URL), { headers: { 'Content-Type': 'application/json' } })
      .then(function (result) { return result.response.json() })
      .then(function (body) { t.equal(body.title, 'hey') })
  })
})

test('middleware modifies response', function (t) {
  t.plan(1)

  fetchware
    .use(type('json'))
    (URL + 'posts/1')
    .then(body => t.equal(body.id, 1))
})

test('middleware modifies request and response', function (t) {
  t.plan(1)

  fetchware
    .use(function (request, next) {
      request.init.method = {}
      request.url = request.url + 'posts/1'
      return next(request)
        .then(function (result) { return result.id })
    })
    .use(function (request, next) {
      request.init.method = 'GET'
      return next(request)
        .then(function (result) { return result.response.json() })
    })
    (new Request(URL), { method: 'POST' })
    .then(function (id) { t.equal(id, 1) })
})
