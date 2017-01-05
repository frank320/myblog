/**
 * Created by frank on 2017/1/3.
 */
const router = require('express').Router()
const User = require('../model/user')
const Post = require('../model/post')
router.get('/u/:user', (req, res, next)=> {
  let data = {}
  if (!req.session.user || req.session.user.name !== req.params.user) {
    return User.get(req.params.user).then(user=> {
      if (!user) {
        //没有此用户 则直接跳转到首页
        return res.redirect('/')
      }
      //如果不是当前账户 则只展示访问的微博内容 不可发布微博
      data.currentUser = req.params.user
      data.title = `${req.params.user}的微博`
      return Post
        .get(req.params.user)
        .then(posts=> {
          data.posts = posts
          return res.render('userInfo', data)
        }).catch(()=> {
          //获取微博数据失败
          return res.redirect('/')
        })
    })


  }
  return User.get(req.params.user).then(user=> {
    if (!user) {
      return res.redirect('/')
    }
    req.session.user = user
    //获取当前用户的所有微博
    return Post
      .get(req.params.user)
      .then(posts=> {
        data.posts = posts
        data.title = '个人主页'
        data.currentUser = req.params.user
        return res.render('user', data)
      })
      .catch(()=> {
        data.title = '个人主页'
        data.currentUser = req.params.user
        data.errTip = '获取用户数据错误'
        return res.render('user', data)
      })
  }).catch(()=> {
    return res.redirect('/')
  })
})

//POST 处理发来的微博内容
router.post('/post', (req, res)=> {
  if (!req.body.post) {
    return res.redirect('/u/' + req.session.user.name)
  }
  const newPost = new Post(req.session.user.name, req.body.post)
  return newPost
    .save()
    .then(()=> {
      //保存成功
      return res.redirect('/u/' + req.session.user.name)
    })
    .catch((err)=> {
      //保存失败
      return res.redirect('/u/' + req.session.user.name)
    })
})

module.exports = router