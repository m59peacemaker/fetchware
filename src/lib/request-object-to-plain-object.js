const assoc = (prop, value, object) => {
  object[prop] = value
  return object
}
const pick = (props, object) => props.reduce((acc, k) => assoc(k, object[k], acc), {})

const requestProps = [
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
  'referrerPolicy'
]

const requestObjectToPlainObject = request => ({
  url: request.url,
  init: pick(requestProps, request)
})

export default requestObjectToPlainObject
