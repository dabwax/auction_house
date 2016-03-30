'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserItems = sequelize.define('UserItems', {
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        UserItems.belongsTo(models.User);
      }
    }
  });
  return UserItems;
};