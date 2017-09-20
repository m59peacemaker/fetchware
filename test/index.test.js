require('reify')
const test = require('tape')
const jsonServer = require('jsonplaceholder/src/app')

const PORT = 3000
const URL = `http://localhost:${PORT}/`

const server = jsonServer.listen(PORT, () => {
  console.log(`JSONPlaceholder listening on ${URL}`)
  require('./tests')
})

test.onFinish(() => server.close())

module.exports = {
  PORT,
  URL
}
