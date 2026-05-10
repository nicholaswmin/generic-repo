'use strict'

/**
 * Test database schema setup
 *
 * Defines and manages the test database schema for the user table
 */

/**
 * Sets up the user table schema for testing
 * Drops existing table if present and creates a fresh one
 *
 * @param {Object} knex - Knex database instance
 * @returns {Promise} Promise that resolves when schema is ready
 */
const setup = (knex) => {
  return knex.schema.dropTableIfExists('user').then(() => {
    return knex.schema.createTable('user', (t) => {
      t.string('id_user').primary().notNull()
      t.string('first_name').notNull()
      t.string('last_name').notNull()
      t.json('children').notNull()
    })
  })
}

module.exports = {
  setup
}
