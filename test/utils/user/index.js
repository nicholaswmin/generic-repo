'use strict'

class User {
  constructor(data) {
    this.props = {
      id_user: data.id_user,
      first_name: data.first_name,
      last_name: data.last_name,
      children: data.children
        ? typeof data.children === 'string'
          ? JSON.parse(data.children)
          : data.children
        : []
    }
  }

  getId() {
    return this.props.id_user
  }

  getName() {
    return this.props.first_name + ' ' + this.props.last_name
  }

  getChildren() {
    return this.props.children
  }
}

module.exports = User
