/**
 * Created by frank on 2017/1/3.
 * 注册
 */
const router = require('express').Router()
const User = require('../model/user')

//GET 登录
router.get('/login', (req, res, next)=> {
  let data = {title: '用户登录'}
  res.render('login', data)
})

//POST 登录
router.post('/login', (req, res)=> {
  let data = {title: '用户登录'}
  if (!req.body.name || !req.body.password) {
    data.errTip = '请输入用户名和密码'
    return res.render('login', data)
  }
  //生成密码的散列值
  const crypto = require('crypto')
  const md5 = crypto.createHash('md5')
  const password = md5.update(req.body.password).digest('base64')

  //检测用户名是否存在
  User.get(req.body.name).then(user=> {
      if (!user) {
        data.errTip = '用户不存在'
        return res.render('login', data)
      } else {
        if (user.name !== req.body.name) {
          data.errTip = '用户名错误'
          return res.render('login', data)
        }
        if (user.password !== password) {
          data.errTip = '密码错误'
          return res.render('login', data)
        }
        //登录成功
        req.session.user = user
        res.redirect('/')
      }
    }
  )
})


module.exports = router
