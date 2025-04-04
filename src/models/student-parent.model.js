const { Sequelize } = require("sequelize");

module.exports = (sequelize, dataType) => {
  const studentParent = sequelize.define("studentParent", {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      foreignKey: true,
    },
    parentId: {
      type: Sequelize.UUID,
      foreignKey: true,
      allowNull: false,
      references: {
        model: "parents",
        key: "id",
      },
    },
    studentId: {
      type: Sequelize.UUID,
      foreignKey: true,
      allowNull: false,
      references: {
        model: "students",
        key: "id",
      },
    },
  });
  return studentParent;
};
