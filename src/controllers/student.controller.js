const catchAsync = require("../utils/catchAsync");
const studentAssignmentService = require("../services/student-assignment.service");
const httpStatus = require("http-status");

const fetchStudentsWithAssignmentCount = catchAsync(async (req, res) => {
  const student =
    await studentAssignmentService.getStudentsWithAssignmentCounts();
  return res.status(httpStatus.OK).json({ status: true, data: student });
});

module.exports = {
  fetchStudentsWithAssignmentCount,
};
