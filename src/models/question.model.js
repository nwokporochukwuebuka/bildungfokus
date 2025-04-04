const { Sequelize } = require("sequelize");

module.exports = (sequelize, dataType) => {
  const question = sequelize.define("question", {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      foreignKey: true,
    },
    text: {
      type: dataType.STRING,
      allowNull: false,
    },
    serialNumber: {
      type: dataType.INTEGER,
    },
    assignmentId: {
      type: Sequelize.UUID,
      foreignKey: true,
    },
    points: {
      type: dataType.INTEGER,
      defaultValue: 10,
    },
    // numberOfPoints: {
    //   type: dataType.INTEGER,
    //   allowNull: false,
    //   defaultValue: 10,
    // },
  });
  return question;
};
