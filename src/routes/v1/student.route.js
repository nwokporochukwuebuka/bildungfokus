const express = require("express");
const auth = require("../../middlewares/auth");
const { userTypes } = require("../../config/enums");
const studentController = require("../../controllers/student.controller");

const router = express.Router();

router.get(
  "/assignment",
  auth(userTypes.TEACHER),
  studentController.fetchStudentsWithAssignmentCount
);

module.exports = router;
