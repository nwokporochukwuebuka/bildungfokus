const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const questionService = require("../services/question.service");
const optionService = require("../services/option.service");
const studentService = require("../services/student.service");
const ApiError = require("../utils/ApiError");

const createQuestion = catchAsync(async (req, res) => {
  const checkSerialNumber =
    await questionService.findQuestionByAssignmentAndSerialNumber(
      req.body.serialNumber,
      req.params.assignmentId
    );

  if (checkSerialNumber) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This  serial Number has been used"
    );
  }

  // create  the question  and then create the option
  const question = await questionService.createQuestion(
    req.body.question,
    req.body.serialNumber,
    req.params.assignmentId,
    req.body.points
  );

  const optionsPayload = req.body.options.map((option) => ({
    ...option,
    questionId: question.id,
  }));

  console.log(optionsPayload);

  // let's create the options
  const options = await optionService.createOptions(optionsPayload);

  return res.status(httpStatus.OK).json({ question, options });
});

// for teacher
const fetchSingleQuestion = catchAsync(async (req, res) => {
  const { assignmentId, serialNumber } = req.params;

  let studentId = null;

  if (req.user.role === "student") {
    const student = await studentService.getStudentByUserId(req.user.id);
    studentId = student.dataValues.id;
  }

  const question =
    await questionService.findQuestionByAssignmentAndSerialNumber(
      serialNumber,
      assignmentId,
      req.user.role,
      studentId
    );

  if (!question) throw new ApiError(httpStatus.NOT_FOUND, "Question not found");

  return res.status(httpStatus.OK).json({ status: true, data: question });
});

const fetchPaginatedQuestionsPerAssignment = catchAsync(async (req, res) => {
  const { assignmentId } = req.params;
  const { page, limit } = req.query;

  const filters = {};

  filters["assignmentId"] = assignmentId;

  const questions = await questionService.fetchQuestionsPerAssignment(
    page,
    limit,
    filters,
    req.user.role
  );
  return res.status(httpStatus.OK).json({ status: true, data: questions });
});

const studentAnswerAssignmentQuestion = catchAsync(async (req, res) => {
  const { questionId, optionId } = req.body;

  const { assignmentId } = req.params;

  const student = await studentService.getStudentByUserId(req.user.id);

  const allOptions = await optionService.fetchAllOptionsForQuestion(questionId);

  if (allOptions.length <= 0)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Question does not have an option"
    );

  const correctOptionId = allOptions.find(
    (option) => option.dataValues.correct === true
  );

  const isCorrectOption = correctOptionId.dataValues.id === optionId;

  const response = await questionService.studentAnswerAssignmentQuestion(
    student.dataValues.id,
    assignmentId,
    questionId,
    optionId,
    isCorrectOption
  );

  const overallProgress = await questionService.calculateOverallScore(
    assignmentId,
    student.dataValues.id
  );

  return res
    .status(httpStatus.OK)
    .json({ status: true, response, overallProgress });
});

const deleteQuestionController = catchAsync(async (req, res) => {
  const { assignmentId } = req.params;
  const { questionId } = req.body;

  await questionService.deleteQuestion(questionId, assignmentId);
  return res
    .status(httpStatus.OK)
    .json({ status: true, message: "Assignment deleted successfully" });
});

module.exports = {
  createQuestion,
  fetchSingleQuestion,
  fetchPaginatedQuestionsPerAssignment,
  studentAnswerAssignmentQuestion,
  deleteQuestionController,
};
