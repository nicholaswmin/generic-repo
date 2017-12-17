'use strict'

module.exports = (chai, utils) => {
  utils.addProperty(chai.Assertion.prototype, 'userInstance', function () {
    this._obj.should.be.ok
    this._obj.should.have.property('props')
    this._obj.props.should.be.an('Object')

    this._obj.props.should.have.property('id_user')
    this._obj.props.id_user.should.be.a('String')

    this._obj.props.should.have.property('first_name')
    this._obj.props.first_name.should.be.a('String')

    this._obj.props.should.have.property('last_name')
    this._obj.props.last_name.should.be.a('String')
  })
}
