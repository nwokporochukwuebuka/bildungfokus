const { Sequelize } = require("sequelize");
const { studentStatusAssignment } = require("../config/enums");

module.exports = (sequelize, dataType) => {
  const studentAssignment = sequelize.define("studentassignment", {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      foreignKey: true,
    },
    studentId: {
      type: Sequelize.UUID,
      fooreignKey: true,
      allowNull: false,
    },
    assignmentId: {
      type: Sequelize.UUID,
      fooreignKey: true,
      allowNull: false,
    },
    assignedAt: {
      type: dataType.DATE,
    },
    gradedAt: {
      type: dataType.DATE,
    },
    dueDate: {
      type: dataType.DATE,
    },
    status: {
      type: dataType.ENUM(
        studentStatusAssignment.CANCELLED,
        studentStatusAssignment.PENDING,
        studentStatusAssignment.SUBMITTED,
        studentStatusAssignment.GRADED,
        studentStatusAssignment.IN_PROGRESS
      ),
      defaultValue: studentStatusAssignment.PENDING,
    },
    score: {
      type: dataType.FLOAT,
      defaultValue: 0,
    },
    maxPossibleScore: {
      type: dataType.FLOAT,
      defaultValue: 0,
    },
    totalScore: {
      type: dataType.FLOAT,
      defaultValue: 0,
    },
    answeredCount: {
      type: dataType.INTEGER,
      defaultValue: 1,
    },
  });

  return studentAssignment;
};
