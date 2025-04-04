const Joi = require("joi");

const createTopicValidation = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    subjectId: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
};

const fetchAllTopicUnpaginatedPerSubjectValidation = {
  params: Joi.object().keys({
    subjectId: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
};

const fetchAllTopicPerSubjectValidation = {
  query: Joi.object().keys({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
  }),
  params: Joi.object().keys({
    subjectId: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
};

module.exports = {
  createTopicValidation,
  fetchAllTopicUnpaginatedPerSubjectValidation,
  fetchAllTopicPerSubjectValidation,
};
