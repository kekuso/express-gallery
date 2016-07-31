'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      name: "John",
      password: "PasswordJohn",
      role: "Admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    {
      name: "Jill",
      password: "PasswordJill",
      role: "Standard",
      createdAt: new Date(),
      updatedAt: new Date(),
      }], {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
