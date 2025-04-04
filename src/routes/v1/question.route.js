const express = require("express");
const validate = require("../../middlewares/validate");
const questionValidation = require("../../validations/question.validation");
const auth = require("../../middlewares/auth");
const { userTypes } = require("../../config/enums");
const questionController = require("../../controllers/question.controller");
const assignmentEligibility = require("../../middlewares/canSubmitAssignment");

const router = express.Router();

router.post(
  "/:assignmentId",
  auth(userTypes.TEACHER),
  validate(questionValidation.createQuestionValidation),
  questionController.createQuestion
);

// for teacher
router.get(
  "/assignment/:assignmentId",
  auth(userTypes.TEACHER),
  validate(questionValidation.fetchPaginatedQuestionsPerAssignmentValidation),
  questionController.fetchPaginatedQuestionsPerAssignment
);

router.get(
  "/:assignmentId/:serialNumber",
  auth("teacher", "student"),
  validate(questionValidation.fetchSingleQuestionValidation),
  questionController.fetchSingleQuestion
);

router.post(
  "/answer/:assignmentId",
  auth(userTypes.STUDENT),
  validate(questionValidation.answerQuestionValidation),
  assignmentEligibility,
  questionController.studentAnswerAssignmentQuestion
);

router.delete(
  "/:assignmentId",
  auth(userTypes.TEACHER),
  validate(questionValidation.deleteQuestionValidation),
  questionController.deleteQuestionController
);

module.exports = router;
