const Joi = require("joi");

const addStudentValidation = {
  body: Joi.object().keys({
    studentId: Joi.string().required(),
  }),
};

module.exports = { addStudentValidation };
