const { Sequelize } = require("sequelize");
const { tokenTypes } = require("../config/tokens");

module.exports = (sequelize, dataType) => {
  const plan = sequelize.define("plan", {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      foreignKey: true,
    },
    name: {
      type: dataType.STRING,
      allowNull: false,
    },
    price: {
      type: dataType.FLOAT,
      allowNull: false,
    },
    benefits: {
      type: dataType.JSON,
    },
    duration: {
      type: dataType.ENUM("yearly", "monthly"),
      defaultValue: "monthly",
    },
    currency: {
      type: dataType.ENUM("dollar", "euro"),
      defaultValue: "euro",
    },
  });
  return plan;
};
