const { Sequelize } = require("sequelize");

module.exports = (sequelize, dataType) => {
  const studentAssignmentAnswer = sequelize.define(
    "student-assignment-answer",
    {
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
      questionId: {
        type: Sequelize.UUID,
        fooreignKey: true,
        allowNull: false,
      },
      assignmentId: {
        type: Sequelize.UUID,
        fooreignKey: true,
        allowNull: false,
      },
      selectedOption: {
        type: Sequelize.UUID,
        fooreignKey: true,
        allowNull: false,
      },
      isCorrect: {
        type: dataType.BOOLEAN,
        defaultValue: false,
      },
      gradedAt: {
        type: dataType.DATE,
        defaultValue: Sequelize.NOW,
      },
      correctCount: {
        type: dataType.FLOAT,
        defaultValue: 1,
      },
      // createdAt: {
      //   type: dataType.DATE,
      //   defaultValue: Sequelize.NOW,
      // },
    }
  );

  return studentAssignmentAnswer;
};
