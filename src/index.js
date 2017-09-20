import compose from '@m59/compose-middleware'
import fetch from 'node-fetch'
import requestObjectToPlainObject from './lib/request-object-to-plain-object'

const fetchMiddleware = request => fetch(request.url, request.init)

const Fetchware = (middleware = []) => {
  const fetchware = (input, init) => {
    /* normalize and clone by passing through Request constructor,
      then pull properties off of request instance because they are read-only
    */
    const request = requestObjectToPlainObject(new fetch.Request(input, init))
    return compose(middleware.concat(fetchMiddleware))(request)
  }
  fetchware.use = fnOrArray => Fetchware(middleware.concat(fnOrArray))
  return fetchware
}

export default Fetchware()

export {
  fetchMiddleware
}
