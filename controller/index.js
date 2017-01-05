/**
 * Created by frank on 2017/1/3.
 * 首页
 */
const router = require('express').Router()
const Post = require('../model/post')
//GET 首页
router.get('/', (req, res, next)=> {
  let data = {}
  if (req.session.user) {//如果用用户登录 直接跳转到当前用户
    data.title = '用户主页'
    return res.redirect('/u/' + req.session.user.name)
  }
  //未登录时显示最近6条发布的微博
  return Post
    .get()
    .then(posts=> {
      data.posts = posts.slice(0, 66)
      data.title = '首页'
      return res.render('index', data)
    })
    .catch(()=> {
      data.posts = []
      data.title = '首页'
      return res.render('index', data)
    })

})

module.exports = router