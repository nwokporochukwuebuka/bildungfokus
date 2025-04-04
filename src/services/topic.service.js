const { db } = require("../models");
const { getPaginatedData } = require("../utils/paginate");

const createTopic = async (name, subjectId, description = null) => {
  return await db.topic.create({
    name,
    description,
    subjectId,
  });
};

const fetchAllTopicPerSubject = async (page, limit, filters) => {
  const topic = await getPaginatedData(db.topic, {
    page: parseInt(page === undefined ? 1 : page, 10),
    limit: parseInt(limit === undefined ? 10 : limit, 10),
    sortField: "createdAt",
    sortOrder: "DESC",
    dateField: "createdAt",
    filters,
    include: [{ model: db.subject, attributes: ["id", "name", "slug"] }],
  });
  return topic;
};

const fetchAllTopicUnpaginatedPerSubject = async (subjectId) => {
  return await db.topic.findAll({
    where: { subjectId },
    include: [{ model: db.subject, attributes: ["id", "name", "slug"] }],
  });
};

module.exports = {
  createTopic,
  fetchAllTopicUnpaginatedPerSubject,
  fetchAllTopicPerSubject,
};
