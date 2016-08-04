'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Pictures', [{
      title:"image1",
      author:"author1",
      url:"https://placeimg.com/640/480/any",
      description:"random image",
      createdAt: new Date(),
      updatedAt: new Date()},

      {title:"image2",
      author:"author2",
      url:"https://placeimg.com/400/200/any",
      description:"random image 2",
      createdAt: new Date(),
      updatedAt: new Date()},

      {title:"image3",
      author:"author3",
      url:"https://placeimg.com/400/200/any",
      description:"random image 3",
      createdAt: new Date(),
      updatedAt: new Date()},

      {title:"image4",
      author:"author4",
      url:"https://placeimg.com/400/200/any",
      description:"random image 4",
      createdAt: new Date(),
      updatedAt: new Date()

      }], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Pictures', [{
      title: "image1"
    },

    {
      title: "image2"
    },

    {
      title: "image3"
    },

    {
      title: "image4"
    }]);
  }
};
