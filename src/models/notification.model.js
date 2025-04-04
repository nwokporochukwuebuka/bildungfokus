const validator = require("validator");
const { Sequelize } = require("sequelize");

module.exports = (sequelize, dataType) => {
  const notification = sequelize.define("notification", {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      foreignKey: true,
    },
    title: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    description: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    link: {
      type: dataType.STRING,
      allowNull: true,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
  });

  return notification;
};
