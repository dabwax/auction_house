'use strict';
module.exports = function(sequelize, DataTypes) {
  var Auction = sequelize.define('Auction', {
    quantity: DataTypes.INTEGER,
    current_bid: DataTypes.INTEGER,
    minimum_bid: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    UserItemId: DataTypes.INTEGER,
    already_checked: DataTypes.INTEGER,
    current_bid_author: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Auction.belongsTo(models.User, {foreignKey: 'UserId'});
        Auction.belongsTo(models.UserItems);
      }
    }
  });
  return Auction;
};