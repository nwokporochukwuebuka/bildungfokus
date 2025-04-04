const httpStatus = require("http-status");
const { db } = require("../models");

const fetchAllGrades = async () => {
  return await db.grade.findAll({});
};

module.exports = {
  fetchAllGrades,
};
