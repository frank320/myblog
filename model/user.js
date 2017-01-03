/**
 * Created by frank on 2016/12/30.
 * 用户数据模型
 */
const mongodb = require('./db')
class User {
  constructor({name,password}) {
    this.name = name
    this.password = password
  }

  save() {
    return new Promise((resolve, reject)=> {
      mongodb.open((err, db)=> {
        if (err) return reject(err)
        db.collection('users', (err, collection)=> {
          if (err) {
            mongodb.close()
            return reject(err)
          }
          const user = {
            name: this.name,
            password: this.password
          }
          //为name属性添加索引
          collection.ensureIndex('name', {unique: true})
          //写入user文档
          collection.insert(user, {safe: true}, (err, user)=> {
            mongodb.close()
            if (err) return reject(err)
            return resolve('save ok')
          })

        })
      })
    })
  }

  static get(username) {
    return new Promise((resolve, reject)=> {
      mongodb.open((err, db)=> {
        if (err) return reject(err)
        db.collection('users', (err, collection)=> {
          if (err) {
            mongodb.close()
            return reject(err)
          }
          //查找文档
          collection.findOne({name: username}, (err, doc)=> {
            mongodb.close()
            if (err) return reject(err)
            if (doc) {
              //封装为User对象 并返回
              return resolve(new User(doc))
            } else {
              //不存在返回0
              return resolve(0)
            }
          })
        })
      })
    })
  }
}

module.exports = User