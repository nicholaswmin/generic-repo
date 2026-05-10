# Database Testing Utilities

This module provides utilities for working with SQLite databases in tests.

## Overview

Based on the latest sqlite3 documentation and best practices, this module offers:
- Database connection management
- Schema setup and teardown helpers
- Support for both file-based and in-memory databases

## Usage

### Creating a Test Database

```js
const { createTestDb, createInMemoryDb } = require('./utils/db')

// File-based database (default: './test_db.sqlite')
const db = createTestDb()

// In-memory database (faster, isolated)
const inMemoryDb = createInMemoryDb()

// Custom configuration
const customDb = createTestDb({
  filename: './custom_test.db',
  useNullAsDefault: true
})
```

### Setting Up Tables

```js
const { resetTable } = require('./utils/db')

// Reset a table with a schema
await resetTable(db, 'users', (t) => {
  t.increments('id').primary()
  t.string('name').notNull()
  t.string('email').unique()
})
```

### Cleaning Up

```js
const { closeDb } = require('./utils/db')

// Close database connection
await closeDb(db)
```

### Schema Setup

The `setup` module provides predefined schema setup for common test tables:

```js
const dbSetup = require('./utils/db/setup')

beforeEach(() => {
  return dbSetup.setup(knex)
})
```

## API Reference

### `createTestDb(options)`

Creates a knex instance for file-based testing.

**Parameters:**
- `options.filename` (string): Database file path (default: './test_db.sqlite')
- `options.useNullAsDefault` (boolean): Use NULL as default value (default: true)

**Returns:** Knex instance

### `createInMemoryDb()`

Creates a knex instance with an in-memory SQLite database. Ideal for fast, isolated tests.

**Returns:** Knex instance

### `resetTable(db, tableName, schemaBuilder)`

Drops and recreates a table with the given schema.

**Parameters:**
- `db` (Object): Knex instance
- `tableName` (string): Name of the table
- `schemaBuilder` (Function): Function that defines the table schema

**Returns:** Promise

### `closeDb(db)`

Closes the database connection.

**Parameters:**
- `db` (Object): Knex instance

**Returns:** Promise

## Best Practices

1. **Use in-memory databases for speed**: In-memory databases are much faster and provide better isolation between tests
2. **Reset tables between tests**: Always drop and recreate tables in `beforeEach` hooks
3. **Close connections**: Call `closeDb()` in `after` or `afterEach` hooks to prevent connection leaks
4. **Use transactions**: For complex test scenarios, wrap tests in transactions that can be rolled back

## Migration from Legacy Code

The old `db-setup` module has been integrated into this unified structure:

**Before:**
```js
const dbSetup = require('./utils/db-setup')
```

**After:**
```js
const dbSetup = require('./utils/db/setup')
```
