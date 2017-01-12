/**
 * Created by frank on 2016/12/29.
 */
const path = require('path')
const fs = require('fs')

const express = require('express')
const app = express()
const template = require('art-template')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const glob = require('glob')
const logger = require('morgan')

//模板引擎配置
app.set('views', path.join(__dirname, './views'))
app.engine('.html', template.__express)
app.set('view engine', 'html')

//处理静态资源
app.use(express.static(path.join(__dirname, './public')))

//解析请求体的中间件
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json({strict: false, limit: '100MB'}))

//处理cookie的中间件
app.use(cookieParser())

//记录日志
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
// setup the logger
app.use(logger('combined', {stream: accessLogStream}))


//存储会话标识的中间件
const config = require('./config')
app.use(session({
  secret: config.COOKIE_SECRET,
  store: new MongoStore({
    url: `mongodb://${config.MONGODB_HOST}/${config.MONGODB_NAME}`
  })
}))

//注册路由
glob.sync('./controller/**/*.js', {cwd: __dirname}).forEach(item=> {
  const router = require(item)
  app.use(router)
})

//监听一个端口
app.listen(3000, (err)=> {
  if (!err) console.log(`server is running at port 3000`)
})


