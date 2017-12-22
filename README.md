# generic-repo
Generic [Repository][repository] for objects, based on [knex][knex].

[![Build Status](https://travis-ci.org/nicholaswmin/generic-repo.svg?branch=master)](https://travis-ci.org/nicholaswmin/generic-repo)

## Install

```bash
$ npm i --save generic-repo
```

## Usage

### A persistable Class

A Class can be persisted if it satisfies the following criteria:

- 1st argument of it's constructor accepts an `Object` that contains
  at least all the persistable properties.
- It has a `props` property that contains all the props that should be
  persisted.

```javascript
class User {
  constructor(data) {
    this.props = {  
      id_user: data.id_user,
      name: data.name
    }

    // Anything outside `props` will *not* be persisted
    // - e.g `age` property will not be persisted
    this.age = 15
  }

  getName() {
    return this.name
  }
}
```

A usage example using the above `User` Class:

```javascript
const GenericRepo = require('generic-repo')
const knex = require('knex')({
  client: 'sqlite3',
  connection: { filename: './test_db.sqlite' }
})

const genericRepo = new GenericRepo({
  tableName: 'user',
  primaryKey: 'id_user',
  Class: User
})

genericRepo.upsert(knex, new User({
    id_user: 'lxkkfv',
    name: 'John Doe'
  }))
  .then(() => {
    return genericRepo.get(knex, { id_user: 'lxkkfv' })
  })
  .then(user => {
    console.log(user.getName()) // 'John Doe'
  })
```

Ensure that your DB already has the table/columns you declared when
you instantiated the repo.

## API

### `upsert(knex, instance)`

- Inserts the instance if it does not exist by primary key.
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

- Returns an instance that matches the filter.
- Returns `undefined` if no instance is found.

```javascript
genericRepo.getAll(knex, { name: 'John Doe' }).then(user => {
  console.log(result) // logs the 'John Doe' instance
})
```

### `exists(knex, filter)`

- Returns `true` if a result is found, `false` otherwise.

```javascript
genericRepo.exists(knex, { name: 'John Doe' }).then(result => {
  console.log(result) // logs `true`
})
```

### `del(knex, filter)`

- Removes/Deletes the instance that matches the filter.
- Does nothing if no instance is found (no-op).

```javascript
genericRepo.del(knex, { name: 'John Doe' }).then(() => {
  // Instance with name 'John Doe' was removed from the DB
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

```
$ npm test
```

## Authors

- Nicholas Kyriakides, [@nicholaswmin][nicholaswmin-github]

## License

MIT

[repository]: https://msdn.microsoft.com/en-us/library/ff649690.aspx
[knex]: http://knexjs.org/
[nicholaswmin-github]: https://github.com/nicholaswmin
