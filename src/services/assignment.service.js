const httpStatus = require("http-status");
const { db } = require("../models");
const ApiError = require("../utils/ApiError");
const { getPaginatedData } = require("../utils/paginate");
const studentService = require("./student.service");
const {
  studentStatusAssignment,
  assignmentStatus,
} = require("../config/enums");
const notificationService = require("./notification.service");
const parentService = require("./parent.service");

const createAssignment = async (
  subjectId,
  topicId,
  gradeId,
  title,
  teacherId,
  description = null
) => {
  // first check if the topic belongs to the subject that is being treated

  const checkSubject = await db.topic.findOne({
    where: { subjectId, id: topicId },
  });

  // if we don't see, we bounce it back that the
  if (!checkSubject)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This topic is not under this  subject"
    );

  // if all is well then let's create
  return await db.assignment.create({
    title,
    description,
    // startDate: new Date(startDate),
    // dueDate: new Date(dueDate),
    subjectId,
    gradeId,
    topicId,
    teacherId,
  });
};

const fetchSingleAssignment = async (assignmentId, teacherId) => {
  return await db.assignment.findOne({
    where: { teacherId, id: assignmentId },
    include: [
      { model: db.grade, attributes: ["id", "name", "slug"] },
      { model: db.subject, attributes: ["id", "name", "slug", "description"] },
      { model: db.topic, attributes: ["id", "name", "description"] },
    ],
  });
};

const startAssignmenntService = async (assignmentId, studentId) => {
  // update the student assignment table
  const check = await db.studentAssignment.findOne({
    where: {
      studentId,
      assignmentId,
      status: studentStatusAssignment.IN_PROGRESS,
    },
  });
  if (check) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Assignment started already");
  }
  await db.studentAssignment.update(
    {
      status: studentStatusAssignment.IN_PROGRESS,
    },
    { where: { studentId, assignmentId } }
  );
  return await db.studentAssignment.findOne({
    where: { studentId, assignmentId },
  });
};

const queryAssignment = async (
  page,
  limit,
  sortField,
  sortOrder,
  startDate,
  endDate,
  filters
) =>
  getPaginatedData(db.assignment, {
    page: parseInt(page === undefined ? 1 : page, 10),
    limit: parseInt(limit === undefined ? 10 : limit, 10),
    sortField: sortField || "createdAt",
    sortOrder: sortOrder || "DESC",
    dateField: "createdAt",
    filters,
    startDate,
    endDate,
    include: [
      { model: db.subject, attributes: ["id", "name", "slug"] },
      { model: db.topic, attributes: ["id", "name"] },
      { model: db.grade, attributes: ["id", "name", "slug"] },
    ],
  });

const fetchAssignmentById = async (assignmentId) => {
  return await db.assignment.findByPk(assignmentId);
};

const assignAssignmentToStudent = async (
  assignmentId,
  studentId,
  startDate,
  startTime,
  endTime,
  dueDate
) => {
  const assignment = await fetchAssignmentById(assignmentId);

  const student = await studentService.getStudentById(studentId);

  const startDateTime = new Date(`${startDate}T${startTime}:00`);

  const endDateTime = new Date(`${dueDate}T${endTime}:00`);

  if (!student) throw new ApiError(httpStatus.NOT_FOUND, "Student not found");

  if (!assignment)
    throw new ApiError(httpStatus.NOT_FOUND, "Assignment not found");

  // check if the student has been assigned the assignment before
  const check = await db.studentAssignment.findOne({
    where: { studentId: student.id, assignmentId: assignment.id },
  });

  if (check)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This student has been assigned this assignment previously"
    );

  await db.studentAssignment.create({
    studentId: student.dataValues.id,
    assignmentId: assignment.dataValues.id,
    assignedAt: new Date(),
    status: studentStatusAssignment.PENDING,
    assignedAt: new Date(),
    dueDate: endDateTime,
    startDate: startDateTime,
  });

  await db.assignment.update(
    { status: assignmentStatus.ASSIGNED },
    {
      where: {
        id: assignment.dataValues.id,
      },
    }
  );

  // send notification to student
  await notificationService.createNotification(
    "New Assignment",
    `You have a new assignment that is to be submitted on the ${new Date(
      dueDate
    ).toISOString()}`,
    student.dataValues.userId
  );

  // check if the student has a parent and also send the notification to his/her parent
  const checkParent = await parentService.fetchStudentParent(
    student.dataValues.id
  );

  if (checkParent) {
    await notificationService.createNotification(
      "New Assignment For Your Ward",
      `Your ward have beeb assigned an assignment that is to be submitted on the ${new Date(
        dueDate
      ).toISOString()}`,
      checkParent.dataValues.parentId
    );
  }

  return await db.studentAssignment.findOne({
    where: {
      assignmentId: assignment.dataValues.id,
      studentId: student.dataValues.id,
    },
  });
};

const fetchAssignedAssignments = async (page, limit, filters) => {
  console.log({ filters });
  return await getPaginatedData(db.studentAssignment, {
    page,
    limit,
    filters,
    include: [
      {
        model: db.assignment,
        attributes: ["id", "title", "description"],
        include: [{ model: db.subject, attributes: ["id", "name"] }],
        include: [
          { model: db.topic, attributes: ["id", "name", "description"] },
        ],
        include: [
          {
            model: db.subject,
            attributes: ["id", "name", "slug", "description"],
          },
        ],
      },
    ],
  });
};

module.exports = {
  createAssignment,
  queryAssignment,
  fetchSingleAssignment,
  fetchAssignmentById,
  assignAssignmentToStudent,
  fetchAssignedAssignments,
  startAssignmenntService,
};
