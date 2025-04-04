const { Sequelize } = require("sequelize");

module.exports = (sequelize, dataType) => {
  const option = sequelize.define("options", {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      foreignKey: true,
    },
    text: {
      type: dataType.STRING,
    },
    correct: {
      type: dataType.BOOLEAN,
      defaultValue: false,
    },
    questionId: {
      type: Sequelize.UUID,
      foreignKey: true,
    },
  });
  return option;
};
