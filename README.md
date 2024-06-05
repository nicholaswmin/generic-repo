# generic-repo
Generic [Repository][repository] for objects, based on [knex][knex].

[![test-workflow][test-workflow-badge]][ci-test]

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

### Property serialisation

#### Complex property values

If a prop is of type `Object` it will be converted into a JSON before inserting
into the database. You should handle this case appropriately in your Class
constructor (see `children` prop of `User` below).

#### Non-complex prop values

Non-complex values such as `Number`, `String`, `Boolean` are send to the
database as-is.


```javascript
class User {
  constructor(data) {
    this.props = {  
      id_user: data.id_user,
      name: data.name,
      // Some DB's might not support a JSON datatype.
      // Therefore we might also need to *parse* back the result.
      children: data.children
        ? typeof data.children === 'string'
          ? JSON.parse(data.children)
          : data.children
        : []
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
  constructAs: data => new User(data)
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
  constructor() {
    super({
      tableName: 'employees',
      primaryKey: 'id_employee',
      constructAs: data => new Employee(data)
    })
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
[ci-test]: https://github.com/nicholaswmin/generic-repo/actions/workflows/tests.yml
