# fetchware

Middleware for the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). Works in browsers and node.

## install

```
$ npm install fetchware
```

## example

```js
import fetchware from 'fetchware'

fetchware
  .use(someFetchMiddleware)
  .use(anotherFetchMiddleware)
  (someUrl, { method: 'POST' })
  .then(response => response.json())
```


## api

### `fetchware(url, init)`

Unless you attach middleware with `fetchware.use`, `fetchware` works just like `fetch`.

```js
fetchware(url, init)
  .then(response => {})
```

### `fetchware.use(middleware)`

Takes middleware and returns a new `fetchware` that has that middleware attached.

```js
const fooBarFetch = fetchware
  .use(fooMiddleware)
  .use(barMiddleware)

const bazQuxFetch = fetchware
  .use(bazMiddleware)
  .use(barMiddleware)

// whatever this is, it sounds like a good time
const fooBarBazQuxFetch = fetchware
  .use(fooBarFetch)
  .use(bazQuxMiddleware)

fooBarBazQuxFetch('/it/started/in/here', { method: 'GET' })
```

#### `middleware`

Can be a middleware function or array of middleware functions.

Functions receive an object with a `url` property that is a string and an `init` property that is an options object for the request.

Middleware must pass a request object to `next` for the next middleware to use.

After the request is made and the next middleware has handled the response, a middleware can handle/modify the response by using `next(request).then(response =>`.

```js
(request, next) => {
  return next(request)
    .then(response => {
     return response
    })
}
```
