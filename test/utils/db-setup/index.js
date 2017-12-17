'use strict'

module.exports = {
  setup: knex => {
    return knex.schema.dropTableIfExists('user').then(() => {
      return knex.schema.createTableIfNotExists('user', (t) => {
        t.string('id_user').primary().notNull()
        t.string('first_name').notNull()
        t.string('last_name').notNull()
      })
    })
  }
}
