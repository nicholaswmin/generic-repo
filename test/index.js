'use strict'

const { GenericRepo, User, knex, dbSetup } = require('./bootstrap.js')

const testUsers = {
  johnDoe: new User({
    id_user: 'ghkkxl', first_name:'John', last_name: 'Doe'
  }),
  maryJane: new User({
    id_user: 'rrvkkw', first_name:'Mary', last_name: 'Jane'
  })
}

const genericRepo = new GenericRepo({
  tableName: 'user',
  primaryKey: 'id_user',
  Class: User
})

beforeEach(() => {
  return dbSetup.setup(knex)
})

describe('Passed instance is same type as declared Class', () => {
  describe('#upsert()', () => {
    it('inserts a new instance if it does not exists by primary Key', () => {
      return genericRepo.upsert(knex, testUsers.johnDoe).then(result => {
        return genericRepo.getAll(knex)
      }).then(result => {
        result.should.have.length(1)
        result[0].should.be.a.userInstance
        result[0].getId().should.equal('ghkkxl')
        result[0].getName().should.equal('John Doe')
      })
    })

    it('updates the instance if it exists by primary Key', () => {
      return genericRepo.upsert(knex, testUsers.maryJane).then(result => {
        return genericRepo.getAll(knex)
      }).then(result => {
        result.should.have.length(1)
        result[0].should.be.a.userInstance
        result[0].getId().should.equal('rrvkkw')
        result[0].getName().should.equal('Mary Jane')
      })
    })
  })

  describe('#getAll()', () => {
    let users

    beforeEach(() => {
      return genericRepo.upsert(knex, testUsers.johnDoe).then(() => {
        return genericRepo.upsert(knex, testUsers.maryJane)
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
      return genericRepo.upsert(knex, testUsers.johnDoe).then(() => {
        return genericRepo.upsert(knex, testUsers.maryJane)
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

  describe('#del()', () => {
    let users

    beforeEach(() => {
      return genericRepo.upsert(knex, testUsers.johnDoe).then(() => {
        return genericRepo.upsert(knex, testUsers.maryJane)
      })
    })

    it('removes the instance that matches the filter', () => {
      return genericRepo.del(knex, { id_user: 'rrvkkw' })
        .then(() => {
          return genericRepo.getAll(knex).then(users => {
            users.should.have.length(1)
          })
        })
    })
  })
})

describe('Passed instance is a sub-Class of declared Class', () => {
  class Person extends User {
    constructor(data) {
      super(data)

      this.props = Object.assign(this.props, {
        social_security_no: data.social_security_no
      })
    }
  }

  const personJohnDoe = new Person({
    id_user: 'rokkal',
    first_name: 'John',
    last_name: 'Doe',
    social_security_no: '111-222-333'
  })

  it('only persists props of declared Class (ignores sub-class props)', () => {
    return genericRepo.upsert(knex, personJohnDoe).then(result => {
      return genericRepo.get(knex, { id_user: 'rokkal'})
    }).then(result => {
      result.should.be.a.userInstance
      result.should.not.have.key('social_security_no')
    })
  })
})
