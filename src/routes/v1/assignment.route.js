const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { userTypes } = require("../../config/enums");
const assignmentController = require("../../controllers/assignment.controller");
const assignmentValidation = require("../../validations/assignment.validation");

const router = express.Router();

router.post(
  "",
  auth(userTypes.TEACHER),
  validate(assignmentValidation.createAssignemntValidation),
  assignmentController.createAssignment
);

router.get(
  "/",
  auth(userTypes.TEACHER),
  assignmentController.fetchAllAssignment
);

router.get(
  "/:assignmentId",
  auth(userTypes.TEACHER),
  assignmentController.fetchSingleAssignment
);

router.post(
  "/assign",
  auth(userTypes.TEACHER),
  validate(assignmentValidation.assignAssignmentValidation),
  assignmentController.assignAssignmentController
);

router.get(
  "/assign/student",
  auth(userTypes.STUDENT),
  assignmentController.fetchStudentAssignedAssignment
);

router.post(
  "/start",
  auth(userTypes.STUDENT),
  validate(assignmentValidation.startAssignmentValidation),
  assignmentController.startAssignmentController
);

module.exports = router;
