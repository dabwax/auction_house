'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: 1000
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        User.hasMany(models.UserItems);
      }
    }
  });
  return User;
};