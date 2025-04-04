const Joi = require("joi");

const createSubjectValidation = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
  }),
};

module.exports = {
  createSubjectValidation,
};
