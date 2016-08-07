// test-db.js

var db = require('./models');

function run() {
  var picture = db.Picture.findOne({
    include: {
      model: db.User
    }
    });

  picture.then(function (picture) {
    console.log(picture.user);
    // picture.getUser()
    //   .then(function (user) {
    //     console.log(user.name);
    //   });
  });
}

db.sequelize.sync().then(run);

