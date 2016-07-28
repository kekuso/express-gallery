'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Pictures', [{
      title:"image1",
      author:"author1",
      url:"https://placeimg.com/640/480/any",
      description:"random image",
      id:0,
      createdAt: new Date(),
      updatedAt: new Date()},

      {title:"image2",
      author:"author2",
      url:"https://placeimg.com/400/200/any",
      description:"random image 2",
      id:1,
      createdAt: new Date(),
      updatedAt: new Date()},

      {title:"image3",
      author:"author3",
      url:"https://placeimg.com/400/200/any",
      description:"random image 3",
      id:2,
      createdAt: new Date(),
      updatedAt: new Date()},

      {title:"image4",
      author:"author4",
      url:"https://placeimg.com/400/200/any",
      description:"random image 4",
      id:3,
      createdAt: new Date(),
      updatedAt: new Date()

      }], {});
  },

  down: function (queryInterface, Sequelize) {

  }
};
