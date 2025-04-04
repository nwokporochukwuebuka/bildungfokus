const { db } = require("../models");
const { getPaginatedData } = require("../utils/paginate");

const createNotification = async (title, body, userId) => {
  return await db.notification.create({ title, description: body, userId });
};

const fetchAllUsersNotification = async (page, limit, filters) => {
  return await getPaginatedData(db.notification, {
    page: parseInt(page === undefined ? 1 : page, 10),
    limit: parseInt(limit === undefined ? 1 : limit, 10),
    sortField: "createdAt",
    sortOrder: "DESC",
    dateField: "createdAt",
    filters,
  });
};

module.exports = {
  createNotification,
  fetchAllUsersNotification,
};
