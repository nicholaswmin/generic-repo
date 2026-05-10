'use strict'

const User = require('./utils/user')
const db = require('./utils/db')
const dbSetup = require('./utils/db/setup.js')

module.exports = {
  GenericRepo: require('../index.js'),
  db,
  dbSetup,
  User,
  knex: db.createInMemoryDb()
}
