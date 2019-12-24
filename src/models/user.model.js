'use strict'

const utils = require('../utils/utils')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    uuid: {
      allowNull: false,
      unique: true,
      type: 'BINARY(32)',
      defaultValue: () => Buffer(utils.uuid(), 'hex'),
      get: function () {
        return Buffer.from(this.getDataValue('uuid')).toString('hex')
      }
    },
    email: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    }
  }, {
    tableName: 'users',
    timestamps: true,
  })

  User.associate = function(models) {
    // associations
  }

  // hooks

  User.prototype.toWeb = function () {
    const values = Object.assign({}, this)

    delete values.id
    delete values.password

    return values
  }

  return User
}