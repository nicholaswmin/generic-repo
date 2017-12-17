'use strict'

const chai = require('chai')
const userInstanceAssertion = require('./utils/user/test/user.assertion.js')

chai.use(userInstanceAssertion)
chai.should()

module.exports = {
  chai,
  GenericRepo: require('../index.js'),
  dbSetup: require('./utils/db-setup'),
  User: require('./utils/user'),
  userInstanceAssertion,
  knex: require('knex')({
    client: 'sqlite3',
    connection: {
      filename: './test_db.sqlite'
    },
    useNullAsDefault: true
  })
}
