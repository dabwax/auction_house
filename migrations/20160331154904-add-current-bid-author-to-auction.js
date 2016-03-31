'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('Users', { id: Sequelize.INTEGER });
    */
    queryInterface.addColumn(
      'Auctions',
      'already_checked',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    );

    return queryInterface.addColumn(
      'Auctions',
      'current_bid_author',
      {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('Auctions');
    */ 

    queryInterface.removeColumn(
      'Auctions',
      'already_checked'
    );
    return queryInterface.removeColumn(
      'Auctions',
      'current_bid_author'
    );
  }
};
