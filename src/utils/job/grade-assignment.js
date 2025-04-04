const cron = require("node-cron");
const { studentStatusAssignment } = require("../../config/enums");
const { db } = require("../../models");
const { Op } = require("sequelize");

const gradeDueAssignment = async () => {
  const dueAssignments = await db.studentAssignment.findAll({
    where: {
      status: {
        [Op.in]: [
          studentStatusAssignment.IN_PROGRESS,
          studentStatusAssignment.PENDING,
        ],
      },
    },
  });
  console.log("Pending Assignments", { dueAssignments });

  for (const assignment of dueAssignments) {
    if (isAssignmentDue(assignment.dueDate)) {
      calculateAssignment(assignment.studentId, assignment.assignmentId);
    }
  }
};

const calculateAssignment = async (studentId, assignmentId) => {
  const assignmentQuestions = await db.question.findAll({
    where: { assignmentId },
    attributes: ["id", "points"],
    include: [
      {
        model: db.option,
        where: { correct: true },
        attributes: ["id", "text"],
        required: false,
      },
    ],
  });

  if (assignmentQuestions.length === 0) {
    return false; // No questions in this assignment
  }

  const studentAnswers = await db.studentAssignmentAnswer.findAll({
    where: { assignmentId, studentId },
    attributes: ["id", "questionId", "selectedOption", "isCorrect"],
  });

  if (studentAnswers.length === 0) {
    return false;
  }

  let totalScore = 0;
  let maxPossibleScore = 0;
  let answeredCount = 0;

  // 3. Calculate scores
  for (const question of assignmentQuestions) {
    const points = question.dataValues?.points || 10;
    maxPossibleScore += points;

    const studentAnswer = studentAnswers.find(
      (a) => a.questionId === question.dataValues.id
    );

    // Skip if question wasn't answered
    if (!studentAnswer || studentAnswer.selectedOption === null) {
      continue;
    }

    answeredCount++;

    const correctOption = question.Options?.[0];
    if (!correctOption) continue;

    if (studentAnswer.selectedOption === correctOption.id) {
      totalScore += points;
    }
  }

  // STEP 7: Calculate final score
  const percentageScore =
    maxPossibleScore > 0
      ? Math.round((totalScore / maxPossibleScore) * 100)
      : 0;

  await db.studentAssignment.update(
    {
      score: percentageScore,
      totalScore: totalScore,
      maxPossibleScore: maxPossibleScore,
      status: studentStatusAssignment.GRADED,
      answeredCount,
    },
    {
      where: {
        studentId,
        assignmentId,
      },
    }
  );
};

const isAssignmentDue = async (date) => {
  const dueDate = new Date(date);

  const now = new Date();

  return now > dueDate;
};

const startAssignmentGradingCron = async () => {
  cron.schedule("0 * * * *", async () => {
    console.log("Start automatic grading of some assignments");

    try {
      const result = await gradeDueAssignment();
      console.log(result);
    } catch (error) {
      console.error("Grading job failed", error);
    }
  });
};

module.exports = startAssignmentGradingCron;
