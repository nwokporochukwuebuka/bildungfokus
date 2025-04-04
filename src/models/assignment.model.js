const { Sequelize } = require("sequelize");
const { assignmentStatus } = require("../config/enums");

module.exports = (sequelize, dataType) => {
  const assignment = sequelize.define("assignment", {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      foreignKey: true,
    },
    title: {
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
    gradeId: {
      type: Sequelize.UUID,
      foreignKey: true,
    },
    topicId: {
      type: Sequelize.UUID,
      foreignKey: true,
    },
    teacherId: {
      type: Sequelize.UUID,
      foreignKey: true,
    },
    status: {
      type: dataType.ENUM(
        assignmentStatus.ASSIGNED,
        assignmentStatus.DUE,
        assignmentStatus.PENDING,
        assignmentStatus.CANCELLED
      ),
      defaultValue: assignmentStatus.PENDING,
    },
  });
  return assignment;
};
