//加载 http 和 fs 这两个模块
var http = require("http")
var fs = require("fs")
//创建一个服务器
http.createServer(function(req, res) {
  //静态服务器：
  if(req.url === "/index.html") {
    //设置响应头
    res.setHeader("Content-Type", "text/html; charset = utf-8")
    //用 utf-8 的方式去读这个文件：
    var html = fs.readFileSync("public/index.html", "utf-8")
    console.log(html)
    //把得到的 html写在响应体里：
    res.write(html)
  //动态接口：   
  }else if(req.url = "./getNews") {
    res.setHeader("Content-Type", "application/json; charset = utf-8")
    //随便写的一些数据进行测试：
    var rawData = [
      "新闻 01",
      "新闻 02",
      "新闻 03",
      "新闻 04",
      "新闻 05",
      "新闻 06",
      "新闻 07",
      "新闻 08",
      "新闻 09",
      "新闻 10",
      "新闻 11",
      "新闻 12",
      "新闻 13",
      "新闻 14",
      "新闻 15"
    ]

    //生成随机5条数据：
    var data = []
    for(var i=0; i<5; i++) {
      data.push(rawData[Math.floor(Math.random() * rawData.length)])
    }
    console.log(data)
    //将这个 JSON 数据 data 变成字符串后发给前端
    res.write(JSON.stringify(data))
  }
  res.end()
}).listen(3000)//通过http对象中的listen方法指定服务器的使用端口及服务器绑定地址