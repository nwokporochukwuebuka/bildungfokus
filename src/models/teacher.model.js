const { Sequelize } = require("sequelize");
module.exports = (sequelize, dataType) => {
  const teacher = sequelize.define("teacher", {
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
  return teacher;
};
