const express = require("express");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const { userTypes } = require("../../config/enums");
const teacherValidation = require("../../validations/teacher.validation");
const teacherController = require("../../controllers/teacher.controller");

const router = express.Router();

router.post(
  "/student",
  auth(userTypes.TEACHER),
  validate(teacherValidation.addStudent),
  teacherController.addStudentToTeacherController
);

router.get(
  "/student",
  auth(userTypes.TEACHER),
  teacherController.fetchAssignedStudentController
);

module.exports = router;
