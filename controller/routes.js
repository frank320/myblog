/**
 * Created by frank on 2016/12/30.
 * 应用路由控制
 */
const app = require('../app.js')
app.get('/', (req, res, next)=> {
  let data = {title: '首页'}
  res.render('index', data)
})

