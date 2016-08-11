'use strict';
module.exports = function(sequelize, DataTypes) {
  var Picture = sequelize.define('Picture', {
    title: {
      type: DataTypes.STRING,
      unique: true
    },
    author: DataTypes.STRING,
    url: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.Picture.belongsTo(models.User, {
          foreignKey: 'user_id',
          targetKey: 'id',
          as: 'user'
        });
      }
    }
  });
  return Picture;
};