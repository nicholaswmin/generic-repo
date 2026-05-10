'use strict'

const test = require('node:test')
const { GenericRepo, User, knex, dbSetup } = require('./bootstrap.js')

const testUsers = {
  johnDoe: new User({
    id_user: 'ghkkxl',
    first_name: 'John',
    last_name: 'Doe',
    nickname: null,
    children: ['foo', 'bar']
  }),
  maryJane: new User({
    id_user: 'rrvkkw',
    first_name: 'Mary',
    last_name: 'Jane',
    nickname: 'MJ',
    children: ['foo', 'bar']
  })
}

const genericRepo = new GenericRepo({
  tableName: 'user',
  primaryKey: 'id_user',
  constructAs: data => new User(data)
})

test('GenericRepo with User instances', async (t) => {
  t.beforeEach(() => dbSetup.setup(knex))
  t.after(() => knex.destroy())

  await t.test('upsert()', async (t) => {
    await t.test('inserts a new instance if it does not exist by primary key', async (t) => {
      await genericRepo.upsert(knex, testUsers.johnDoe)
      const result = await genericRepo.getAll(knex)

      t.assert.strictEqual(result.length, 1)
      t.assert.ok(result[0].props)
      t.assert.strictEqual(typeof result[0].props, 'object')
      t.assert.strictEqual(typeof result[0].props.id_user, 'string')
      t.assert.strictEqual(typeof result[0].props.first_name, 'string')
      t.assert.strictEqual(typeof result[0].props.last_name, 'string')
      t.assert.strictEqual(result[0].getId(), 'ghkkxl')
      t.assert.strictEqual(result[0].getName(), 'John Doe')
    })

    await t.test('updates the instance if it exists by primary key', async (t) => {
      await genericRepo.upsert(knex, testUsers.maryJane)
      const result = await genericRepo.getAll(knex)

      t.assert.strictEqual(result.length, 1)
      t.assert.ok(result[0].props)
      t.assert.strictEqual(result[0].getId(), 'rrvkkw')
      t.assert.strictEqual(result[0].getName(), 'Mary Jane')
    })

    await t.test('handles prop which is typeof === object', async (t) => {
      await genericRepo.upsert(knex, testUsers.maryJane)
      const result = await genericRepo.getAll(knex)

      t.assert.strictEqual(result.length, 1)
      t.assert.deepStrictEqual(result[0].getChildren(), ['foo', 'bar'])
    })

    await t.test('preserves null prop values', async (t) => {
      await genericRepo.upsert(knex, testUsers.johnDoe)
      const user = await genericRepo.get(knex, { id_user: 'ghkkxl' })

      t.assert.strictEqual(user.getNickname(), null)
    })

    await t.test('preserves non-null prop values', async (t) => {
      await genericRepo.upsert(knex, testUsers.maryJane)
      const user = await genericRepo.get(knex, { id_user: 'rrvkkw' })

      t.assert.strictEqual(user.getNickname(), 'MJ')
    })
  })

  await t.test('getAll()', async (t) => {
    t.beforeEach(async () => {
      await genericRepo.upsert(knex, testUsers.johnDoe)
      await genericRepo.upsert(knex, testUsers.maryJane)
    })

    await t.test('returns all instances if not provided with a filter', async (t) => {
      const users = await genericRepo.getAll(knex)

      t.assert.strictEqual(users.length, 2)
      users.forEach(user => {
        t.assert.ok(user.props)
        t.assert.strictEqual(typeof user.props.id_user, 'string')
      })
    })

    await t.test('returns only instances that match the filter', async (t) => {
      const users = await genericRepo.getAll(knex, { id_user: 'rrvkkw' })

      t.assert.strictEqual(users.length, 1)
      t.assert.ok(users[0].props)
      t.assert.strictEqual(users[0].props.id_user, 'rrvkkw')
    })
  })

  await t.test('get()', async (t) => {
    t.beforeEach(async () => {
      await genericRepo.upsert(knex, testUsers.johnDoe)
      await genericRepo.upsert(knex, testUsers.maryJane)
    })

    await t.test('returns undefined if no results are found', async (t) => {
      const user = await genericRepo.get(knex, { id_user: 'kkaiiw' })

      t.assert.strictEqual(typeof user, 'undefined')
    })

    await t.test('returns the instance that matches the filter', async (t) => {
      const user = await genericRepo.get(knex, { id_user: 'rrvkkw' })

      t.assert.ok(user.props)
      t.assert.strictEqual(user.props.id_user, 'rrvkkw')
    })
  })

  await t.test('exists()', async (t) => {
    t.beforeEach(async () => {
      await genericRepo.upsert(knex, testUsers.johnDoe)
      await genericRepo.upsert(knex, testUsers.maryJane)
    })

    await t.test('returns false if no result is found', async (t) => {
      const result = await genericRepo.exists(knex, { id_user: 'kkaiiw' })

      t.assert.strictEqual(result, false)
    })

    await t.test('returns true if a result is found', async (t) => {
      const result = await genericRepo.exists(knex, { id_user: 'rrvkkw' })

      t.assert.strictEqual(result, true)
    })
  })

  await t.test('del()', async (t) => {
    t.beforeEach(async () => {
      await genericRepo.upsert(knex, testUsers.johnDoe)
      await genericRepo.upsert(knex, testUsers.maryJane)
    })

    await t.test('removes the instance that matches the filter', async (t) => {
      await genericRepo.del(knex, { id_user: 'rrvkkw' })
      const users = await genericRepo.getAll(knex)

      t.assert.strictEqual(users.length, 1)
    })
  })
})
