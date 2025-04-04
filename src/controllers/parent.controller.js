const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const parentService = require("../services/parent.service");

const addStudentToParentController = catchAsync(async (req, res) => {
  const parent = await parentService.getParentByUserId(req.user.id);
  const addedStudent = await parentService.addStudentToParent(
    req.body.studentId,
    parent.dataValues.id
  );
  return res.status(httpStatus.OK).json({ status: true, data: addedStudent });
});

const fetchParentStudentController = catchAsync(async (req, res) => {
  const { page, limit } = req.query;

  const filters = {};

  const parent = await parentService.getParentByUserId(req.user.id);

  filters["parentId"] = parent.dataValues.id;
  const result = await parentService.getChildren(page, limit, filters);
  return res.status(httpStatus.OK).json({ status: true, data: result });
});

module.exports = {
  addStudentToParentController,
  fetchParentStudentController,
};
