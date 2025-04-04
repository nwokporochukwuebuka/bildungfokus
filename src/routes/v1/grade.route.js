const express = require("express");
const gradeController = require("../../controllers/grade.controller");

const router = express.Router();

router.get("/", gradeController.fetchAllGradeController);

module.exports = router;
