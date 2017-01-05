/**
 * Created by frank on 2016/12/30.
 * 微博内容数据模型
 */
const mongodb = require('./db')
const moment = require('moment')
class Post {
  constructor(user, post, time = +new Date()) {
    this.user = user
    this.post = post
    this.time = time
  }

  save() {
    return new Promise((resolve, reject)=> {
      mongodb.open((err, db)=> {
        if (err) return reject(err)
        db.collection('posts', (err, collection)=> {
          if (err) {
            mongodb.close()
            return reject(err)
          }
          const post = {
            post: this.post,
            user: this.user,
            time: this.time
          }
          //写入文档
          collection.dropIndexes() //移除当前索引
          collection.insertOne(post, {safe: true}, (err, post)=> {
            mongodb.close()
            if (err) return reject(err)
            return resolve('save ok')
          })

        })
      })
    })
  }

  static get(userName) {
    return new Promise((resolve, reject)=> {
      mongodb.open((err, db)=> {
        if (err) return reject(err)
        db.collection('posts', (err, collection)=> {
          if (err) {
            mongodb.close()
            return reject(err)
          }
          let query = !userName ? {} : {user: userName}
          //查找文档
          collection.find(query).sort({time: -1}).toArray((err, docs)=> {
            mongodb.close()
            if (err) return reject(err)
            //处理并存储微博数据
            let posts = []
            docs.forEach(item=> {
              const post = new Post(item.user, item.post, moment(item.time).format('YYYY-MM-DD HH:mm:ss'))
              posts.push(post)
            })
            return resolve(posts)
          })
        })
      })
    })
  }
}

module.exports = Post