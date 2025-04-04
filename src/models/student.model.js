const { Sequelize } = require("sequelize");

module.exports = (sequelize, dataType) => {
  const student = sequelize.define("student", {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      foreignKey: true,
    },
    dateOfBirth: {
      type: dataType.DATE,
      allowNull: true,
    },
    // grade: {
    //   type: sequelize.enum(
    //     "grade_one",
    //     "grade_two",
    //     "grade_three",
    //     "grade_four"
    //   ),
    // },
    acheivements: { type: dataType.FLOAT, defaultValue: 0 },
    specialId: { type: dataType.STRING, allowNull: false },
    userId: {
      type: Sequelize.UUID,
      foreignKey: true,
    },
  });
  return student;
};
