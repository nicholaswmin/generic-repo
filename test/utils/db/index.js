'use strict'

const knex = require('knex')

/**
 * Database utilities for testing with SQLite3
 *
 * Provides helper functions for:
 * - Creating test database connections
 * - Setting up and tearing down test schemas
 * - Managing test data lifecycle
 */

/**
 * Creates a knex instance for testing
 * @param {Object} options - Configuration options
 * @param {string} options.filename - Database file path (default: './test_db.sqlite')
 * @param {boolean} options.useNullAsDefault - Use NULL as default value (default: true)
 * @returns {Object} Knex instance
 */
const createTestDb = (options = {}) =>
  knex({
    client: 'sqlite3',
    connection: {
      filename: options.filename || './test_db.sqlite'
    },
    useNullAsDefault: options.useNullAsDefault ?? true
  })

const createInMemoryDb = () =>
  knex({
    client: 'sqlite3',
    connection: { filename: ':memory:' },
    useNullAsDefault: true
  })

const resetTable = (db, tableName, schemaBuilder) =>
  db.schema.dropTableIfExists(tableName).then(() =>
    db.schema.createTable(tableName, schemaBuilder)
  )

const closeDb = db => db.destroy()

module.exports = {
  createTestDb,
  createInMemoryDb,
  resetTable,
  closeDb
}
