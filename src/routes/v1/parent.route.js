const express = require("express");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const { userTypes } = require("../../config/enums");
const parentValidation = require("../../validations/parent.validation");
const parentController = require("../../controllers/parent.controller");

const router = express.Router();

router.post(
  "/student",
  auth(userTypes.PARENT),
  validate(parentValidation.addStudentValidation),
  parentController.addStudentToParentController
);

router.get(
  "/student",
  auth(userTypes.PARENT),
  parentController.fetchParentStudentController
);

module.exports = router;
