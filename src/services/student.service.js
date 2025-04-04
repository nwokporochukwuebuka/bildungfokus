const { db } = require("../models");
const { generateStudentId } = require("../utils/generate-id");

const createStudent = async (userId, username) => {
  const studentId = generateStudentId(username);
  console.log(studentId);
  return await db.student.create({ userId, specialId: studentId });
};

const getStudentById = async (studentId) => {
  return await db.student.findOne({ where: { specialId: studentId } });
};

const getStudentByUserId = async (userId) => {
  return await db.student.findOne({ where: { userId } });
};

module.exports = {
  getStudentById,
  createStudent,
  getStudentByUserId,
};
