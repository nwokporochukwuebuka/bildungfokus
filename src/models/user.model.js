const validator = require("validator");
const { Sequelize } = require("sequelize");
const { userTypes } = require("../config/enums");

module.exports = (sequelize, dataType) => {
  const user = sequelize.define("user", {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      foreignKey: true,
    },
    firstName: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    lastName: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    email: {
      type: dataType.STRING,
      allowNull: false,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    username: {
      type: dataType.STRING,
      allowNull: false,
    },
    password: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
    },
    isEmailVerified: {
      type: dataType.BOOLEAN,
      defaultValue: false,
    },

    gender: {
      type: dataType.ENUM(["male", "female"]),
      allowNull: true,
    },

    role: {
      type: dataType.ENUM(
        userTypes.PARENT,
        userTypes.STUDENT,
        userTypes.TEACHER
      ),
    },
  });

  return user;
};
