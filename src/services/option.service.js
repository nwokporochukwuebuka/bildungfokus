const { db } = require("../models");

const createOptions = async (payload) => {
  return await db.option.bulkCreate(payload);
};

const fetchAllOptionsForQuestion = async (questionId) =>
  db.option.findAll({ where: { questionId } });

const deleteAllQuestionOptions = async (questionId) => {
  return await db.option.destroy({
    where: {
      questionId,
    },
  });
};

module.exports = {
  createOptions,
  fetchAllOptionsForQuestion,
  deleteAllQuestionOptions,
};
