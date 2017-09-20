var requestProps = [
  'bodyUsed',
  'cache',
  'context',
  'credentials',
  'headers',
  'integrity',
  'method',
  'mode',
  'redirect',
  'referrer',
  'referrerPolicy',
  'url'
]

var requestToObject = function (request) {
  return {
    url: request.url,
    init: requestProps.reduce(function (acc, k) {
      var value = request[k]
      if (!(typeof value === 'function' || k === 'url')) {
        acc[k] = value
      }
      return acc
    }, {})
  }
}

module.exports = requestToObject
