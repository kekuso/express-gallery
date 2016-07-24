module.exports = function(sequelize, DataTypes) {
  var Picture = sequelize.define("Picture", {
    title: {
      type: DataTypes.STRING,
      unique: true
    },
    author: DataTypes.STRING,
    url: DataTypes.STRING,
    description: DataTypes.STRING
  });

  return Picture;
};