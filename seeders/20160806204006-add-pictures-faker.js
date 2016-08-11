'use strict';
var faker = require('faker');

module.exports = {
  up: function (queryInterface, Sequelize) {
    var randomFirst = faker.name.firstName();
    var randomLast = faker.name.lastName();
    var name = randomFirst + " " + randomLast;
    var randomImage = faker.image.imageUrl(600, 400, "people" + "/" + Math.floor(Math.random() * 10));
    var randomTitle = faker.lorem.word(1);
    var randomDescription = faker.lorem.sentence(5);
    var randomId = Math.floor(Math.random() * 2) + 1;


    var fakePictures = [];

    for(var i = 0; i < 20; i++) {
      randomFirst = faker.name.firstName();
      randomLast = faker.name.lastName();
      name = randomFirst + " " + randomLast;
      randomImage = faker.image.imageUrl(600, 400, "people" + "/" + Math.floor(Math.random() * 10));
      randomTitle = faker.lorem.word(1) + i;
      randomDescription = faker.lorem.sentence(5);
      randomId = parseInt(Math.floor(Math.random() * 2) + 1);

      var fakePicture = {
        title:randomTitle,
        author:name,
        url:randomImage,
        description:randomDescription,
        user_id: randomId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      fakePictures.push(fakePicture);
    }
    return queryInterface.bulkInsert('Pictures', fakePictures);
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Pictures');
  }
};
