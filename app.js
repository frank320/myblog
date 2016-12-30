/**
 * Created by frank on 2016/12/29.
 */
const path = require('path')
const express = require('express')
const app = express()
const template = require('art-template')

//模板引擎配置
app.set('views', path.join(__dirname, './views'))
app.engine('.html', template.__express)
app.set('view engine', 'html')

//处理静态资源中间件
app.use(express.static(path.join(__dirname, './public')))

//导出app实例
module.exports = app
//载入路由
require('./controller/routes.js')

app.listen(3000, (err)=> {
  if (!err) console.log(`server is running at port 3000`)
})


