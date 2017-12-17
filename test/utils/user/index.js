'use strict'

class User {
  constructor({ id_user, first_name, last_name }) {
    this.props = {
      id_user,
      first_name,
      last_name
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
