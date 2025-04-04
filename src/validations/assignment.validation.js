const Joi = require("joi");

const createAssignemntValidation = {
  body: Joi.object().keys({
    description: Joi.string().optional(),
    title: Joi.string().required(),
    // startDate: Joi.date().iso().required(),
    // dueDate: Joi.date().iso().greater(Joi.ref("startDate")).required(),
    subjectId: Joi.string().uuid({ version: "uuidv4" }).required(),
    topicId: Joi.string().uuid({ version: "uuidv4" }).required(),
    gradeId: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
};

const assignAssignmentValidation = {
  body: Joi.object().keys({
    assignmentId: Joi.string().uuid({ version: "uuidv4" }).required(),
    studentId: Joi.string().uuid({ version: "uuidv4" }).required(),
    startDate: Joi.date().iso().greater("now").required(),
    dueDate: Joi.date().iso().greater(Joi.ref("startDate")).required(),
    startTime: Joi.string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .required(),
    endTime: Joi.string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .required(),
  }),
};

const startAssignmentValidation = {
  body: Joi.object().keys({
    assignmentId: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
};

module.exports = {
  createAssignemntValidation,
  assignAssignmentValidation,
  startAssignmentValidation,
};
