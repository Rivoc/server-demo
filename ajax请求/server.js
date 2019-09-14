var http = require("http")
var fs = require("fs")
http.createServer(function (req, res) {
  if (req.url === "/index.html") {
    res.setHeader("Content-Type", "text/html; charset = utf-8")
    var html = fs.readFileSync("./index.html", "utf-8")
    res.write(html)
  }
  else if (req.url == '/getData') {
    res.setHeader("Content-Type", "application/json; charset = utf-8")
    var data = ["小明", "小红", "小花", "小芳", "小李", "小王"]
    var randomNames = []
    for (i = 0; i < 2; i++) {
      var index = Math.floor(Math.random() * data.length)//获取随机下标
      randomNames.push(data[index])
      data.splice(index, 1)//删除已输出的数组元素，避免下次随机拿到该元素，造成重复
      console.log(i + "" + data)
    }
    res.write(JSON.stringify(randomNames))
  }
  res.end()
}).listen(3000)