'use strict'

const { GenericRepo, User, knex, dbSetup } = require('./bootstrap.js')

const genericRepo = new GenericRepo({
  tableName: 'user',
  primaryKey: 'id_user',
  Class: User
})

beforeEach(() => {
  return dbSetup.setup(knex)
})

describe('#upsert()', () => {
  it('inserts a new instance if it does not exists by primary Key', () => {
    return genericRepo.upsert(knex, new User({
      id_user: 'ghkkxl',
      first_name: 'John',
      last_name: 'Doe'
    })).then(result => {
      return genericRepo.getAll(knex)
    }).then(result => {
      result.should.have.length(1)
      result[0].should.be.a.userInstance
      result[0].getId().should.equal('ghkkxl')
      result[0].getName().should.equal('John Doe')
    })
  })

  it('updates the instance if it exists by primary Key', () => {
    return genericRepo.upsert(knex, new User({
      id_user: 'ghkkxl',
      first_name: 'Mary',
      last_name: 'Doe'
    })).then(result => {
      return genericRepo.getAll(knex)
    }).then(result => {
      result.should.have.length(1)
      result[0].should.be.a.userInstance
      result[0].getId().should.equal('ghkkxl')
      result[0].getName().should.equal('Mary Doe')
    })
  })
})

describe('#getAll()', () => {
  let users

  beforeEach(() => {
    return genericRepo.upsert(
      knex,
      new User({ id_user: 'rrvkkw', first_name:'John', last_name: 'Doe' })
    ).then(() => {
      return genericRepo.upsert(
        knex,
        new User({ id_user: 'kkowlk', first_name:'Mary', last_name: 'Jane' })
      )
    })
  })

  it('returns all instances if not provided with a filter', () => {
    return genericRepo.getAll(knex).then(users => {
      users.should.have.length(2)
      users.forEach(user => {
        user.should.be.a.userInstance
      })
    })
  })

  it('returns only instances that match the filter', () => {
    return genericRepo.getAll(knex, { id_user: 'rrvkkw' }).then(users => {
      users.should.have.length(1)
      users[0].should.be.a.userInstance
      users[0].props.id_user.should.equal('rrvkkw')
    })
  })
})

describe('#get()', () => {
  let users

  beforeEach(() => {
    return genericRepo.upsert(
      knex,
      new User({ id_user: 'rrvkkw', first_name:'John', last_name: 'Doe' })
    ).then(() => {
      return genericRepo.upsert(
        knex,
        new User({ id_user: 'kkowlk', first_name:'Mary', last_name: 'Jane' })
      )
    })
  })

  it('returns undefined if no results are found', () => {
    return genericRepo.get(knex, { id_user: 'kkaiiw' }).then(user => {
      (typeof user).should.be.equal('undefined')
    })
  })

  it('returns the instance that matches the filter', () => {
    return genericRepo.get(knex, { id_user: 'rrvkkw' }).then(user => {
      user.should.be.a.userInstance
      user.props.id_user.should.equal('rrvkkw')
    })
  })
})
