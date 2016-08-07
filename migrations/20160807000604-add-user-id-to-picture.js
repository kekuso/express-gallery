'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    // return queryInterface.createTable('temp_pictures', {
    //   id: {
    //     allowNull: false,
    //     type: Sequelize.INTEGER
    //   },
    //   author: {
    //     type: Sequelize.STRING
    //   }
    // })
    // .then(function () {
      return queryInterface.addColumn('Pictures', 'user_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        foreignKey: true,
        references: {
          model: 'Users',
          key: 'id'
        }
    });
    //   );
    // })
    // .then(function () {
    //   return queryInterface.sequelize
    //     .query('SELECT id, author FROM "Pictures";')
    //     .then(function(results) {
    //       // Get the resulting rows
    //       return results[0];
    //     })
    //     .then(function(pictures) {
    //       return queryInterface.bulkInsert('temp_pictures', pictures)
    //       .then(function () {
    //         return pictures;
    //       });
    //     });
        // .then(function(pictures) {
        //   //grab all user ids set them on the photo table
        //   //where the user id matches the authr name on the photo table
        //   return queryInterface.sequelize
        //   .query('SELECT * FROM "Users" UPDATE "Pictures" SET user_id = temp_pictures.id WHERE ');
        // });
    // });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Pictures', 'user_id');

    // return queryInterface
    // .dropTable('temp_pictures')
    // .then(function () {
    //   return queryInterface
    //     .removeColumn('Pictures', 'user_id');
    // });
  }
};
