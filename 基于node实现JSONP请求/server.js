var http = require('http')
var urlModule = require('url')
const server = http.createServer()
server.on('request', function (req, res) {
  const { pathname: url, query } = urlModule.parse(req.url, true)
  if (url === '/getScript') {
    let data = {
      name: 'Jack'
    }
    let str = `${query.callback}(${JSON.stringify(data)})`
    res.end(str)
  } else {
    res.end('404')
  }

})
server.listen('8002', function () {
})