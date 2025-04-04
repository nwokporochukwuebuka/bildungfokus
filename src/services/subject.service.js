const { db } = require("../models");
const { getPaginatedData } = require("../utils/paginate");

const fetchAllSubjects = async (page, limit) => {
  return await getPaginatedData(db.subject, {
    page,
    limit,
  });
};

const fetchAllSubjectUnPaginated = async () => {
  return await db.subject.findAll();
};

const createSubject = async (payload) => {
  return await db.subject.create(payload);
};

module.exports = {
  fetchAllSubjects,
  createSubject,
  fetchAllSubjectUnPaginated,
};
