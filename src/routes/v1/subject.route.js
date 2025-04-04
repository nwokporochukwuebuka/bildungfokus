const express = require("express");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const { userTypes } = require("../../config/enums");
const subjectController = require("../../controllers/subject.controller");
const subjectValidation = require("../../validations/subject.validation");

const router = express.Router();

router.get(
  "/",
  auth(userTypes.TEACHER),
  subjectController.fetchAllSubjectController
);

router.get(
  "/unpaginated",
  auth(userTypes.TEACHER),
  subjectController.fetchAllUnPaginatedSubjectController
);

router.post(
  "/",
  auth(userTypes.TEACHER),
  validate(subjectValidation.createSubjectValidation),
  subjectController.createSubjectController
);

module.exports = router;
