const { Sequelize } = require("sequelize");
const { studentStatusAssignment } = require("../config/enums");
const { db } = require("../models");

const fetchStudentAssignment = async (studentId, assignmentId) => {
  return await db.studentAssignment.findOne({
    where: { studentId, assignmentId },
  });
};

const changeAssignmentStatusToSubmitted = async (studentId, assignmentId) => {
  return await db.studentAssignment.update(
    {
      status: studentStatusAssignment.SUBMITTED,
    },
    {
      where: {
        studentId,
        assignmentId,
      },
    }
  );
};

const getStudentsWithAssignmentCounts = async () => {
  try {
    const students = await db.student.findAll({
      attributes: [
        "id",
        [
          Sequelize.fn("COUNT", Sequelize.col("studentassignments.id")),
          "assignmentCount",
        ],
      ],
      include: [
        {
          model: db.studentAssignment,
          as: "studentassignments", // Make sure this matches your association alias
          attributes: [], // we don't need to return the join table data
          required: false, // use LEFT JOIN to include students with 0 assignments
        },
        {
          model: db.users,
          as: "user",
          attributes: ["id", "firstName", "lastName"], // only these user fields
          required: true,
        },
      ],
      group: ["student.id", "user.id"], // group by student ID

      raw: false,
    });

    return students;
  } catch (error) {
    console.error("Error fetching students with assignment counts:", error);
    throw error;
  }
};

module.exports = {
  fetchStudentAssignment,
  changeAssignmentStatusToSubmitted,
  getStudentsWithAssignmentCounts,
};
