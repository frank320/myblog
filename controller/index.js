/**
 * Created by frank on 2017/1/3.
 * 首页
 */
const router = require('express').Router()
//GET 首页
router.get('/', (req, res, next)=> {
  let data = {}
  if (req.session.user) {
    data.title = '个人主页'
    data.currentUser = req.session.user.name
    return res.render('user', data)
  }
  data.title = '首页'
  res.render('index', data)
})

module.exports = router