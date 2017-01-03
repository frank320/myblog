/**
 * Created by frank on 2017/1/3.
 */
const router = require('express').Router()

//GET 登出

router.get('/logout', (req, res)=> {
  req.session.user = null
  res.redirect('/')
})

module.exports = router