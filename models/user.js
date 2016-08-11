'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.User.hasMany(models.Picture, {
          foreignKey: 'user_id'
        });
      }
    }
  });
  return User;
};