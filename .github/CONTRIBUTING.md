# Contributing Guide

Thank you for contributing to generic-repo.

## Code Style

Write concise, readable code using modern JavaScript patterns.

### Prefer Concise Patterns

- Use ternaries over if/else for simple conditionals
- Use arrow functions for short callbacks
- Use spread operator over `Object.assign`
- Use nullish coalescing (`??`) over verbose ternaries
- Avoid needless braces, parens, and returns

**Good:**
```js
const result = exists ? update() : insert()
const fn = () => knex({ client: 'sqlite3' })
const obj = { ...base, extra: 'value' }
const value = options.setting ?? true
```

**Avoid:**
```js
let result
if (exists) {
  result = update()
} else {
  result = insert()
}
const fn = () => { return knex({ client: 'sqlite3' }) }
const obj = Object.assign({}, base, { extra: 'value' })
const value = options.setting !== undefined
  ? options.setting : true
```

### Prefer Short-Circuit Evaluation

Use logical operators for conditional execution.

**Good:**
```js
.modify(q => filter && q.where(filter))
```

**Avoid:**
```js
.modify(q => {
  if (filter) q.where(filter)
})
```

### Use Strict Mode

Always start files with `'use strict'`.

```js
'use strict'

class MyClass {
  // ...
}
```

## Testing

We use Node.js built-in test runner with hierarchical tests.

### Test Structure

Use `node:test` with `test()` and `await t.test()` for nesting.

```js
const test = require('node:test')

test('Feature', async (t) => {
  t.beforeEach(() => setup())
  t.after(() => cleanup())

  await t.test('behavior', async (t) => {
    // test code
  })
})
```

### Assertions

Use `t.assert` methods directly (no separate import needed).

- `t.assert.strictEqual()` for exact equality
- `t.assert.deepStrictEqual()` for objects/arrays
- `t.assert.ok()` for truthiness

```js
t.assert.strictEqual(result.length, 1)
t.assert.deepStrictEqual(user.children, ['foo', 'bar'])
t.assert.ok(user.props)
```

### Database Cleanup

**Critical:** Always close database connections to prevent hanging.

```js
test('Database tests', async (t) => {
  t.after(() => knex.destroy())
  // tests...
})
```

### Run Tests

```bash
npm test
```

Tests must pass before submitting a PR.

## Publishing

Publishing is automated from `.github/workflows/tests.yml` after tests pass
on pushes to master when the current package version is not already published.

### Version Bumping

Update version in `package.json` following semver:

- **Major (3.0.0):** Breaking changes
- **Minor (3.1.0):** New features, backward compatible
- **Patch (3.0.1):** Bug fixes

### Publishing Process

The publish workflow automatically:

1. Runs tests
2. Authenticates to npm with OIDC trusted publishing
3. Publishes to npm with provenance

No manual publishing needed.

## Pull Requests

- Keep PRs focused and atomic
- Include tests for new features
- Ensure all tests pass
- Follow existing code patterns
- Write clear commit messages
