const subjectService = require("../services/subject.service");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");

const fetchAllSubjectController = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const subjects = await subjectService.fetchAllSubjects(page, limit);
  return res.status(httpStatus.OK).json({ status: true, data: subjects });
});

const fetchAllUnPaginatedSubjectController = catchAsync(async (req, res) => {
  const subject = await subjectService.fetchAllSubjectUnPaginated();
  return res.status(httpStatus.OK).json({ status: true, data: subject });
});

const createSubjectController = catchAsync(async (req, res) => {
  const { name, description } = req.body;
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-");

  const payload = { name, description, slug };
  const subject = await subjectService.createSubject(payload);
  return res.status(httpStatus.CREATED).json({ status: true, data: subject });
});

module.exports = {
  fetchAllSubjectController,
  fetchAllUnPaginatedSubjectController,
  createSubjectController,
};
