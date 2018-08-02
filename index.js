'use strict'

class GenericRepo {
  constructor({ tableName, primaryKey, constructAs }) {
    this.tableName = tableName
    this.primaryKey = primaryKey
    this.constructAs = constructAs
  }

  async upsert(db, instance) {
    const exists = await this.get(db, {
      [this.primaryKey]: instance.props[this.primaryKey]
    })

    if (exists) {
      return await this._update(db, instance)
    } else {
      return await this._insert(db, instance)
    }
  }

  del(db, filter) {
    return db.table(this.tableName).where(filter).del()
  }

  getAll(db, filter) {
    return db.table(this.tableName)
      .modify(q => {
        if (filter) q.where(filter)
      })
      .map(data => this.constructAs(data))
  }

  exists(db, filter) {
    return db.table(this.tableName)
      .first(this.primaryKey)
      .where(filter)
      .then(result => !!result)
  }

  get(db, filter) {
    return db.table(this.tableName)
      .first()
      .where(filter)
      .then(data => data ? this.constructAs(data) : undefined)
  }

  _insert(db, instance) {
    return db(this.tableName)
      .insert(Object.assign(
        { },
        this._getPersistableTuple(instance),
        {
          [this.primaryKey]: instance.props[this.primaryKey]
        }
      ))
  }

  _update(db, instance) {
    return db(this.tableName)
      .update(this._getPersistableTuple(instance, { ignorePrimaryKey: true }))
      .where({
        [this.primaryKey]: instance.props[this.primaryKey]
      })
  }

  _getPersistableTuple(instance, { ignorePrimaryKey = false } = {}) {
    return Object.keys(instance.props).reduce((obj, key) => {
      if (ignorePrimaryKey && key === this.primaryKey) return obj

      return Object.assign(obj, {
        [key]: typeof instance.props[key] === 'object'
          ? JSON.stringify(instance.props[key])
          : instance.props[key]
      })
    }, {})
  }
}

module.exports = GenericRepo
