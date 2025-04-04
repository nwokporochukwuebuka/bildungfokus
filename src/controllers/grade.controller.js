const catchAsync = require("../utils/catchAsync");
const gradeService = require("../services/grade.service");
const httpStatus = require("http-status");

const fetchAllGradeController = catchAsync(async (req, res) => {
  const grades = await gradeService.fetchAllGrades();
  return res.status(httpStatus.OK).json({ status: true, data: grades });
});

module.exports = {
  fetchAllGradeController,
};
