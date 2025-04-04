const Joi = require("joi");

const addStudent = {
  body: Joi.object().keys({
    studentId: Joi.string().required(),
  }),
};

module.exports = {
  addStudent,
};
