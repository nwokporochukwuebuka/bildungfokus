const { Sequelize } = require("sequelize");

module.exports = (sequelize, dataType) => {
  const topic = sequelize.define("topic", {
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
    description: {
      type: dataType.STRING,
      allowNull: true,
    },
    subjectId: {
      type: Sequelize.UUID,
      foreignKey: true,
    },
  });
  return topic;
};
