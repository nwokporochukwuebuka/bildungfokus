const { Sequelize } = require("sequelize");

module.exports = (sequelize, dataType) => {
  const studentTeacher = sequelize.define("studentTeacher", {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      foreignKey: true,
    },
    teacherId: {
      type: Sequelize.UUID,
      foreignKey: true,
      allowNull: false,
      references: {
        model: "teachers",
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
  return studentTeacher;
};
