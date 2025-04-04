const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");
const exclude = require("../utils/exclude");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

const userUpdateProfile = catchAsync(async (req, res) => {
  await userService.updateUserById(req.user.id, req.body);
  const user = await userService.getUserById(req.user.id);
  return res
    .status(httpStatus.OK)
    .json({ user: exclude(user.dataValues, ["password"]) });
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getUserProfile = catchAsync(async (req, res) => {
  return res.status(httpStatus.OK).json({
    data: await userService.getUserWithUserType(req.user.id, req.user.role),
  });
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  // updateUser,
  deleteUser,
  userUpdateProfile,
  getUserProfile,
};
