const catchAsync = require("../utils/catchAsync");
const topicService = require("../services/topic.service");
const httpStatus = require("http-status");

const createTopicController = catchAsync(async (req, res) => {
  const { name, description, subjectId } = req.body;
  const topic = await topicService.createTopic(name, subjectId, description);
  return res.status(httpStatus.CREATED).json({ data: topic });
});

const fetchAllTopicPerSubjectController = catchAsync(async (req, res) => {
  const { subjectId } = req.params;
  const topics = await topicService.fetchAllTopicUnpaginatedPerSubject(
    subjectId
  );
  return res.status(httpStatus.OK).json({ data: topics });
});

const fetchPaginatedSubjectPerSubjectPaginatedController = catchAsync(
  async (req, res) => {
    const { subjectId } = req.params;
    const { page, limit } = req.query;
    const filters = {};
    filters["subjectId"] = subjectId;
    const topics = await topicService.fetchAllTopicPerSubject(
      page,
      limit,
      filters
    );
    return res.status(httpStatus.OK).json({ data: topics });
  }
);

module.exports = {
  createTopicController,
  fetchAllTopicPerSubjectController,
  fetchPaginatedSubjectPerSubjectPaginatedController,
};
