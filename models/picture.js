module.exports = function(sequelize, DataTypes) {
  var Picture = sequelize.define("Picture", {
    author: DataTypes.STRING,
    url: DataTypes.STRING,
    description: DataTypes.STRING
  });

  return Picture;
};