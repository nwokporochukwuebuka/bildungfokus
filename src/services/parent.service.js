const httpStatus = require("http-status");
const { db } = require("../models");
const ApiError = require("../utils/ApiError");
const studentService = require("./student.service");
const { getPaginatedData } = require("../utils/paginate");

const createParent = async (userId) => {
  return await db.parent.create({ userId });
};

const addStudentToParent = async (studentId, parentId) => {
  const student = await studentService.getStudentById(studentId);

  if (!student) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Student with this username not found"
    );
  }
  const check = await db.studentParent.findOne({
    where: { studentId: student.dataValues.id, parentId },
  });

  if (check)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This student has been added previously"
    );

  const studentParent = await db.studentParent.create({
    parentId,
    studentId: student.dataValues.id,
  });

  return studentParent;
};

const getParentByUserId = async (userId) => {
  const parent = await db.parent.findOne({ where: { userId } });

  if (parent === null)
    throw new ApiError(httpStatus.BAD_REQUEST, "Parent does not exist");

  return parent;
};

const getChildren = async (page, limit, filters) => {
  const result = getPaginatedData(db.studentParent, {
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

const fetchStudentParent = async (studentId) => {
  return await db.studentParent.findOne({ where: { studentId } });
};

module.exports = {
  createParent,
  addStudentToParent,
  getParentByUserId,
  getChildren,
  fetchStudentParent,
};
