const Joi = require("joi");
const { questionOptions } = require("./custom.validation");

const optionSchema = Joi.object({
  text: Joi.string().required(), // Each option must have a `text` field
  correct: Joi.boolean().required(), // Each option must have a `correct` field
});

const createQuestionValidation = {
  params: Joi.object().keys({
    assignmentId: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
  body: Joi.object().keys({
    question: Joi.string().required(),
    serialNumber: Joi.number().integer().required(),
    point: Joi.number().optional(),
    options: Joi.array()
      .items(optionSchema) // Each item in the array must match the `optionSchema`
      .length(4) // The array must have exactly 4 options
      .required() // Ensure the `options` array is present
      .custom(questionOptions),
  }),
};

const fetchSingleQuestionValidation = {
  params: Joi.object().keys({
    serialNumber: Joi.number().integer().required(),
    assignmentId: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
};

const fetchPaginatedQuestionsPerAssignmentValidation = {
  params: Joi.object().keys({
    assignmentId: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
  query: Joi.object().keys({
    page: Joi.number().integer(),
    limit: Joi.number().integer(),
  }),
};

const answerQuestionValidation = {
  params: Joi.object().keys({
    assignmentId: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
  body: Joi.object().keys({
    questionId: Joi.string().uuid({ version: "uuidv4" }).required(),
    optionId: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
};

const deleteQuestionValidation = {
  body: Joi.object().keys({
    questionId: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
  params: Joi.object().keys({
    assignmentId: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
};

module.exports = {
  createQuestionValidation,
  fetchSingleQuestionValidation,
  fetchPaginatedQuestionsPerAssignmentValidation,
  answerQuestionValidation,
  deleteQuestionValidation,
};
