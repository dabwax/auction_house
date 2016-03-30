'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('Users', { id: Sequelize.INTEGER });
    */
    return queryInterface.addColumn(
      'Users',
      'balance',
      {
        type: Sequelize.INTEGER,
        defaultValue: 1000
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('Users');
    */
    return queryInterface.removeColumn(
      'Users',
      'balance'
    );
  }
};
