const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { db } = require("../models");
const studentService = require("./student.service");
const { getPaginatedData } = require("../utils/paginate");

const createTeacher = async (userId) => {
  return await db.teacher.create({ userId });
};

const addStudentToTeacher = async (studentId, teacherId) => {
  const student = await studentService.getStudentById(studentId);

  if (!student)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Student with this username not found"
    );

  // check if that student has been added previously
  const check = await db.studentTeacher.findOne({
    where: { studentId: student.id, teacherId },
  });

  if (check)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This student has been added previosuly"
    );

  // then let's create it
  const studentTeacher = await db.studentTeacher.create({
    teacherId,
    studentId: student.id,
  });

  return studentTeacher;
};

const getTeacherByUserId = async (userId) => {
  const teacher = await db.teacher.findOne({ where: { userId } });

  if (teacher === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Teacher does not exists");
  }
  return teacher;
};

const getAssignedStudents = async (page, limit, filters) => {
  const result = getPaginatedData(db.studentTeacher, {
    page: parseInt(page === undefined ? 1 : page, 10),
    limit: parseInt(limit === undefined ? 10 : limit, 10),
    sortField: "createdAt",
    sortOrder: "DESC",
    dateField: "createdAt",
    filters,
    include: [
      {
        model: db.student,
        attributes: ["specialId", "acheivements"],
        include: [
          {
            model: db.users,
            attributes: [
              "id",
              "lastName",
              "firstName",
              "email",
              "username",
              "gender",
              "username",
            ],
          },
        ],
      },
    ],
  });
  return result;
};

module.exports = {
  addStudentToTeacher,
  createTeacher,
  getTeacherByUserId,
  getAssignedStudents,
};
