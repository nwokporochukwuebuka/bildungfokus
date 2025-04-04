const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { teacherService } = require("../services");

const addStudentToTeacherController = catchAsync(async (req, res) => {
  const teacher = await teacherService.getTeacherByUserId(req.user.id);
  const addedStudent = await teacherService.addStudentToTeacher(
    req.body.studentId,
    teacher.id
  );
  return res.status(httpStatus.OK).json({ data: addedStudent });
});

const fetchAssignedStudentController = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const filters = {};

  const teacher = await teacherService.getTeacherByUserId(req.user.id);

  filters["teacherId"] = teacher.dataValues.id;

  const result = await teacherService.getAssignedStudents(page, limit, filters);
  return res.status(httpStatus.OK).json({ status: true, data: result });
});

module.exports = {
  addStudentToTeacherController,
  fetchAssignedStudentController,
};
