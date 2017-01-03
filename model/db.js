/**
 * Created by frank on 2016/12/30.
 */
const config = require('../config')
const Db = require('mongodb').Db
const Server = require('mongodb').Server
module.exports = new Db(config.MONGODB_NAME, new Server(config.MONGODB_HOST, config.MONGODB_PORT, {}))