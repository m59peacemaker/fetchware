var test = require('tape')
var jsonServer = require('jsonplaceholder/src/app')

var PORT = 3000
var URL = `http://localhost:${PORT}/`

var server = jsonServer.listen(PORT, () => {
  console.log(`JSONPlaceholder listening on ${URL}`)
  require('./tests')
})

test.onFinish(() => server.close())

module.exports = {
  PORT,
  URL
}
