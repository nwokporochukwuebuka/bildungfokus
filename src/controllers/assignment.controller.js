const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const assignmentService = require("../services/assignment.service");
const teacherService = require("../services/teacher.service");
const ApiError = require("../utils/ApiError");
const studentService = require("../services/student.service");

const createAssignment = catchAsync(async (req, res) => {
  const { description, title, subjectId, topicId, gradeId } = req.body;

  const teacher = await teacherService.getTeacherByUserId(req.user.id);

  const assignment = await assignmentService.createAssignment(
    subjectId,
    topicId,
    gradeId,
    title,
    teacher.id,
    description
  );

  return res.status(httpStatus.CREATED).json({ data: assignment });
});

const fetchSingleAssignment = catchAsync(async (req, res) => {
  // fetch the teacher id
  const teacher = await teacherService.getTeacherByUserId(req.user.id);
  return res.status(httpStatus.OK).json({
    data: await assignmentService.fetchSingleAssignment(
      req.params.assignmentId,
      teacher.id
    ),
  });
});

const fetchAllAssignment = catchAsync(async (req, res) => {
  const { page, limit, startDate, endDate, sortField, sortBy, subjectId } =
    req.query;

  // first let's first get the teacher credetials
  const teacher = await teacherService.getTeacherByUserId(req.user.id);

  const filters = {};

  filters["teacherId"] = teacher.id;

  if (subjectId) filters["subjectId"] = subjectId;

  const result = await assignmentService.queryAssignment(
    page || 1,
    limit || 10,
    sortField || "createdAt",
    sortBy || "DESC",
    startDate,
    endDate,
    filters
  );

  return res.status(httpStatus.OK).json({ data: result });
});

const assignAssignmentController = catchAsync(async (req, res) => {
  const { assignmentId, studentId, startDate, startTime, dueDate, endTime } =
    req.body;

  console.log(req.body);

  const result = await assignmentService.assignAssignmentToStudent(
    assignmentId,
    studentId,
    startDate,
    startTime,
    endTime,
    dueDate
  );

  return res.status(httpStatus.OK).json({ status: true, data: result });
});

const startAssignmentController = catchAsync(async (req, res) => {
  const { assignmentId } = req.body;
  const student = await studentService.getStudentByUserId(req.user.id);

  const result = await assignmentService.startAssignmenntService(
    assignmentId,
    student.dataValues.id
  );

  return { status: true, data: result };
});

const fetchStudentAssignedAssignment = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const student = await studentService.getStudentByUserId(req.user.id);
  const assignments = await assignmentService.fetchAssignedAssignments(
    page,
    limit,
    { studentId: student.dataValues.id }
  );
  return res.status(httpStatus.OK).json({ status: true, data: assignments });
});

module.exports = {
  createAssignment,
  fetchAllAssignment,
  fetchSingleAssignment,
  assignAssignmentController,
  fetchStudentAssignedAssignment,
  startAssignmentController,
};
