import test from 'tape'
import { Request } from 'node-fetch'
import fetchware from '../src'
import { URL } from './index.test'

const append = v =>
  (request, next) => {
    request.url = request.url + v
    return next(request)
  }

const type = (t) =>
  (request, next) => next(request)
    .then(response => response[t]())

const reqSet = (prop, v) =>
  (request, next) => {
    request.init[prop] = v
    return next(request)
  }

test('middleware modifies request', t => {
  t.test('string url and init object', t => {
    t.plan(2)

    fetchware
      .use(append('/1'))
      (URL + 'posts')
      .then(response => response.json())
      .then(body => t.equal(body.id, 1, 'modified the url'))

    fetchware
      .use(append('posts'))
      .use(reqSet('method', 'post'))
      .use(reqSet('body', JSON.stringify({
        title: 'hey'
      })))
      // content type header required for jsonplaceholder server to reply like we want
      (URL, { headers: { 'Content-Type': 'application/json' } })
      .then(response => response.json())
      .then(body => t.equal(body.title, 'hey'))
  })

  t.test('Request object', t => {
    t.plan(2)

    fetchware
      .use(append('/1'))
      (new Request(URL + 'posts'))
      .then(response => response.json())
      .then(body => t.equal(body.id, 1, 'modified the url'))

    fetchware
      .use(append('posts'))
      .use(reqSet('method', 'POST'))
      .use(reqSet('body', JSON.stringify({
        title: 'hey'
      })))
      (new Request(URL), { headers: { 'Content-Type': 'application/json' } })
      .then(response => response.json())
      .then(body => t.equal(body.title, 'hey'))
  })
})

test('middleware modifies response', t => {
  t.plan(1)

  fetchware
    .use(type('json'))
    (URL + 'posts/1')
    .then(body => t.equal(body.id, 1))
})

test('middleware modifies request and response', t => {
  t.plan(1)

  fetchware
    .use((request, next) => {
      request.init.method = {}
      request.url = request.url + 'posts/1'
      return next(request)
        .then(response => response.id)
    })
    .use((request, next) => {
      request.init.method = 'GET'
      return next(request)
        .then(response => response.json())
    })
    (new Request(URL), { method: 'POST' })
    .then(id => t.equal(id, 1))
})
