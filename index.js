'use strict'

class GenericRepo {
  constructor({ tableName, primaryKey, Class }) {
    this.tableName = tableName
    this.primaryKey = primaryKey
    this.Class = Class
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
      .map(data => new this.Class(data))
  }

  get(db, filter) {
    return db.table(this.tableName)
      .first()
      .where(filter)
      .then(data => data ? new this.Class(data) : undefined)
  }

  _insert(db, instance) {
    return db(this.tableName)
      .insert(Object.assign(
        { },
        instance.props,
        {
          [this.primaryKey]: instance.props[this.primaryKey]
        }
      ))
  }

  _update(db, instance) {
    return db(this.tableName)
      .update(instance.props)
      .where({
        [this.primaryKey]: instance.props[this.primaryKey]
      })
  }
}

module.exports = GenericRepo
