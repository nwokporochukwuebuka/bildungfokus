const { Sequelize } = require("sequelize");
const { tokenTypes } = require("../config/tokens");

module.exports = (sequelize, dataType) => {
  const parent = sequelize.define("parent", {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      foreignKey: true,
    },
    userId: {
      type: Sequelize.UUID,
      foreignKey: true,
    },
  });

  return parent;
};
