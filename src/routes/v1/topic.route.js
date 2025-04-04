const express = require("express");
const validate = require("../../middlewares/validate");
const topicValidation = require("../../validations/topic.validation");
const topicController = require("../../controllers/topic.controller");
const auth = require("../../middlewares/auth");
const { userTypes } = require("../../config/enums");

const router = express.Router();

router.post(
  "/",
  auth(userTypes.TEACHER),
  validate(topicValidation.createTopicValidation),
  topicController.createTopicController
);

router.get(
  "/unpaginated/:subjectId",
  auth(userTypes.TEACHER),
  validate(topicValidation.fetchAllTopicUnpaginatedPerSubjectValidation),
  topicController.fetchAllTopicPerSubjectController
);

router.get(
  "/:subjectId",
  auth(userTypes.TEACHER),
  validate(topicValidation.fetchAllTopicPerSubjectValidation),
  topicController.fetchPaginatedSubjectPerSubjectPaginatedController
);

module.exports = router;
