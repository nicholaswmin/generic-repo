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
    // @HACK
    // To ensure we *only* persist properties of this Class and not properties
    // of subclasses (classes that inherit from this one), we instantiate
    // a new temp Class and use the instance to infer the props.
    //
    // This will fail if the Class is instantiated in any other way other than
    // than a `props` destructured argument the constructor, for example using
    // multiple arguments.
    //
    // ## Examples:
    //
    // ### Working examples:
    //
    // Class Point {
    //    constructor({ props }) {
    //      this.props = { props.x, props.y }
    //    }
    // }
    //
    // Class Point {
    //    constructor({ props, foo, bar }) {
    //      this.props = { props.x, props.y }
    //
    //      this.foo = foo
    //      this.bar = bar
    //    }
    // }
    //
    // ### Failing examples:
    //
    // Class Point {
    //    constructor(x, y) {
    //      this.props = { x, y }
    //    }
    // }
    //
    // Class Point {
    //    constructor({ data }) {
    //      this.props = { data.x, data.y }
    //    }
    // }
    //
    const tempClass = new this.Class(instance.props)

    return Object.keys(tempClass.props).reduce((obj, key) => {
      if (ignorePrimaryKey && key === this.primaryKey) return obj

      return Object.assign(obj, {
        [key]: tempClass.props[key]
      })
    }, {})
  }
}

module.exports = GenericRepo
