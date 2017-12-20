'use strict'

class User {
  constructor(data) {
    this.props = {
      id_user: data.id_user,
      first_name: data.first_name,
      last_name: data.last_name
    }
  }

  getId() {
    return this.props.id_user
  }

  getName() {
    return this.props.first_name + ' ' + this.props.last_name
  }
}

module.exports = User
