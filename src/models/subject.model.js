const { Sequelize } = require("sequelize");

module.exports = (sequelize, dataType) => {
  const subject = sequelize.define("subject", {
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
    slug: {
      type: dataType.STRING,
      allowNull: false,
    },
    description: {
      type: dataType.STRING,
    },
  });
  return subject;
};
