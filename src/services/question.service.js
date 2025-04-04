const httpStatus = require("http-status");
const {
  userTypes,
  assignmentStatus,
  studentStatusAssignment,
} = require("../config/enums");
const { db } = require("../models");
const ApiError = require("../utils/ApiError");
const { getPaginatedData } = require("../utils/paginate");
const optionService = require("../services/option.service");
const assignmentService = require("./assignment.service");

const createQuestion = async (text, serialNumber, assignmentId, points) => {
  const question = await db.question.create({
    text,
    serialNumber,
    assignmentId,
    points: points ?? 10,
  });
  return question;
};

const findQuestionByAssignmentAndSerialNumber = async (
  serialNumber,
  assignmentId,
  role,
  studentId = null
) => {
  const question = await db.question.findOne({
    where: { assignmentId, serialNumber },
    include: [
      {
        model: db.option,
        attributes:
          role === "teacher" ? ["text", "id", "correct"] : ["text", "id"],
      },
    ],
  });

  if (role === "teacher") {
    return question;
  }

  // check the answers he chose
  const studentAnswer = await db.studentAssignmentAnswer.findOne({
    where: { questionId: question.dataValues.id, studentId, assignmentId },
    attributes: [
      "id",
      "studentId",
      "questionId",
      "assignmentId",
      "selectedOption",
      "isCorrect",
      "gradedAt",
      "correctCount",
    ],
  });

  if (!studentAnswer) {
    return question;
  }

  return { question, studentAnswer };
};

const fetchQuestionsPerAssignment = async (page, limit, filters, userType) => {
  // TODO: Revisit
  if ((userType = userTypes.STUDENT)) {
    // check if the date has reached the due date and tell
  }
  return await getPaginatedData(db.question, {
    page: parseInt(page === undefined ? 1 : page, 10),
    limit: parseInt(limit === undefined ? 10 : limit, 10),
    sortField: "serialNumber",
    sortOrder: "ASC",
    dateField: "createdAt",
    filters,
    include: [{ model: db.option, attributes: ["text", "correct", "id"] }],
  });
};

const studentAnswerAssignmentQuestion = async (
  studentId,
  assignmentId,
  questionId,
  selectedOptionId,
  isCorrect
) => {
  const studentAnswer = await db.studentAssignmentAnswer.findOne({
    where: { studentId, questionId, assignmentId },
  });

  if (studentAnswer) {
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      "This question has been answered"
    );
  }

  await db.studentAssignmentAnswer.create({
    studentId,
    questionId,
    assignmentId,
    selectedOption: selectedOptionId,
    isCorrect,
  });

  await db.studentAssignment.increment("answeredCount", {
    by: 1,
    where: { studentId, assignmentId },
  });

  return {
    isCorrect,
    correctOption: await fetchCorrectOptionOfAQuestion(questionId),
  };
};

const fetchStudentAnswer = async (studentId, questionId, assignmentId) => {
  return await db.studentAssignmentAnswer.findOne({
    where: { studentId, questionId, assignmentId },
  });
};

const fetchCorrectOptionOfAQuestion = async (questionId) => {
  return await db.option.findOne({
    where: {
      questionId,
      correct: true,
    },
  });
};

const findQuestionById = async (questionId, assignmentId) => {
  return await db.question.findOne({ where: { id: questionId, assignmentId } });
};

const deleteQuestion = async (questionId, assignmentId) => {
  const checkQuestion = await findQuestionById(questionId, assignmentId);

  // check if the assignmet has been assigned
  const assignment = await assignmentService.fetchAssignmentById(assignmentId);

  if (
    assignment.dataValues.status === assignmentStatus.DUE ||
    assignment.dataValues.status === assignmentStatus.ASSIGNED
  ) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Assignment is assigned/due and question canoot be deleted"
    );
  }

  if (!checkQuestion)
    throw new ApiError(httpStatus.BAD_REQUEST, "Question does not exist");

  await optionService.deleteAllQuestionOptions(questionId);

  await db.question.destroy({ where: { id: questionId } });
};

const gradeSingleQuestion = async () => {};

const calculateOverallScore = async (assignmentId, studentId) => {
  const answers = await db.studentAssignmentAnswer.findAll({
    where: { assignmentId, studentId },
    include: [{ model: db.question, attributes: ["id", "points"] }],
  });

  const studentAss = await db.studentAssignment.findOne({
    where: { assignmentId, studentId },
  });

  if (!studentAss)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Assignment not found for this student"
    );

  let totalScore = 0;
  let maxPossibleScore = 0;
  let answeredCount = 0;
  let correctCount = 0;

  // Calculate scores only for this student's answers
  answers.forEach((answer) => {
    const points = answer.Question?.points || 1;
    maxPossibleScore += points;

    if (answer.isCorrect) {
      totalScore += points;
      correctCount++;
    }

    if (answer.answer !== null) {
      answeredCount++;
    }
  });

  // Calculate percentage (round to 2 decimal places)
  const percentageScore =
    maxPossibleScore > 0
      ? parseFloat(((totalScore / maxPossibleScore) * 100).toFixed(2))
      : 0;

  // Check if assignment is completed
  const totalQuestions = await db.question.count({
    where: { assignmentId },
  });

  const isCompleted = answeredCount >= totalQuestions;

  // Update the student's assignment record if completed
  if (isCompleted) {
    await db.studentAssignment.update(
      {
        score: percentageScore,
        totalScore,
        maxPossibleScore,
        correctCount,
        status: studentStatusAssignment.GRADED,
        gradedAt: new Date(),
      },
      {
        where: {
          assignmentId,
          studentId,
        },
      }
    );
  }

  return {
    isCompleted,
    currentScore: totalScore,
    maxPossibleScore,
    percentageScore,
    correctCount,
    answeredCount,
    totalQuestions,
  };
};

module.exports = {
  createQuestion,
  findQuestionByAssignmentAndSerialNumber,
  fetchQuestionsPerAssignment,
  studentAnswerAssignmentQuestion,
  fetchStudentAnswer,
  fetchCorrectOptionOfAQuestion,
  deleteQuestion,
  calculateOverallScore,
};
