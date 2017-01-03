/**
 * Created by frank on 2017/1/3.
 * 注册
 */
const router = require('express').Router()
const User = require('../model/user')

//GET 注册页
router.get('/reg', (req, res, next)=> {
  let data = {title: '用户注册'}
  res.render('reg', data)
})

//POST 注册
router.post('/reg', (req, res)=> {
  let data = {title: '用户注册'}
  if (req.body['password-repeat'] != req.body['password']) {
    data.errTip = '两次输入的密码不一致'
    return res.render('reg', data)
  }
  //生成密码的散列值
  const crypto = require('crypto')
  const md5 = crypto.createHash('md5')
  const password = md5.update(req.body.password).digest('base64')

  const newUser = new User({
    name: req.body.name,
    password: password
  })

  //检测用户名是否存在
  User.get(req.body.name).then(user=> {
      if (user) {
        data.errTip = '用户名已经存在'
        return res.render('reg', data)
      } else {
        //新增用户
        newUser.save()
          .then(()=> {
            //向会话对象写入新用户
            req.session.user = newUser
            return res.redirect('/')
          })
          .catch(()=> {
            data.errTip = '注册失败 请重新注册'
            return res.render('reg', data)
          })
      }
    }
  )
})

module.exports = router
