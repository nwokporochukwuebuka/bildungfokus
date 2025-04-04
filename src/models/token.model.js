const { Sequelize } = require("sequelize");
const { tokenTypes } = require("../config/tokens");

module.exports = (sequelize, dataType) => {
  const token = sequelize.define("token", {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      foreignKey: true,
    },
    token: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
      index: true,
    },
    user: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    type: {
      type: dataType.ENUM(
        tokenTypes.REFRESH,
        tokenTypes.RESET_PASSWORD,
        tokenTypes.VERIFY_EMAIL
      ),
      allowNull: false,
    },
    expires: {
      type: dataType.DATE,
      allowNull: false,
    },
    blacklisted: {
      type: dataType.BOOLEAN,
    },
  });

  return token;
};
