const { Sequelize } = require("sequelize");

module.exports = (sequelize, dataType) => {
  const grade = sequelize.define("grade", {
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
  });
  return grade;
};
