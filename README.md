# generic-repo
Generic [Repository][repository] for objects, based on [knex][knex].

[![Build Status](https://travis-ci.org/nicholaswmin/generic-repo.svg?branch=master)](https://travis-ci.org/nicholaswmin/generic-repo)

## Install

```bash
$ npm i --save generic-repo
```

## Usage

Instantiate a `GenericRepo` with:

- The `tableName`, the DB table where instances will be mapped.
- The `primaryKey`, a unique id property for each instance, included
  in a `props` property of the instance.
- The `Class`, the instance Class with the persistable properties
  included in a `props` property.


Here's an example:

```javascript
const GenericRepo = require('generic-repo')
const knex = require('knex')({
  client: 'sqlite3',
  connection: { filename: './test_db.sqlite' }
})

class User {
  constructor({ id_user, name }) {
    // All subproperties of `props` will be persisteds
    this.props = { id_user, name }

    // Everything else will not be persisted
    this.age = 15
  }

  getName() {
    return this.name
  }
}

const genericRepo = new GenericRepo({
  tableName: 'user',
  primaryKey: 'id_user',
  Class: User
})

genericRepo.upsert(knex, new User({ id_user: 'lxkkf', name: 'John Doe' }))
  .then(() => {
    return genericRepo.get(knex, { id_user: 'lxkkf' })
  })
  .then(user => {
    console.log(user.getName()) // 'John Doe'
  })
```

**Important:** Ensure that your DB already has a table name `user` with columns
matching the properties in the `props` property of your instance.

## API

### `upsert(knex, instance)`

- Inserts the object if it does not exist by primary key.
- Updates the instance if it already exists by primary key.

```javascript
genericRepo.upsert(knex, user).then(() => {
  console.log(result) // [1]
})
```

### `getAll(knex, filter)`

- If no filter is provided it returns all saved instances.
- If a filter is provided it returns just the matched instances.

```javascript
genericRepo.getAll(knex, { name: 'John Doe' }).then(users => {
  console.log(users[0].getName()) // logs 'John Doe'
})
```

### `get(knex, filter)`

- Returns an instance that matches the filter
- Returns `undefined` if no instance is found.

```javascript
genericRepo.getAll(knex, { name: 'John Doe' }).then(user => {
  console.log(result) // logs the 'John Doe' instance
})
```

## Extend this repository

This module exports an ES6 `Class` which you can simply `extend`.

```javascript
const GenericRepo = require('generic-repo')

class MySuperWowRepo extends GenericRepo {
  constructor({ tableName, primaryKey, Class }) {
    super({ tableName, primaryKey, Class })
  }

  getAllJohnDoes(knex) {
    return knex(this.tableName)
      .where({ name: 'John Doe' })
  }
}
```

## Test

```bash
$ npm test
```

## Authors

- Nicholas Kyriakides, [@nicholaswmin][nicholaswmin-github]

## License

MIT

[repository]: https://msdn.microsoft.com/en-us/library/ff649690.aspx
[knex]: http://knexjs.org/
[nicholaswmin-github]: https://github.com/nicholaswmin
