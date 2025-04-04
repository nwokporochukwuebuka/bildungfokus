const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const notificationService = require("../services/notification.service");

// const createNotification = catchAsync(async (req, res) => {
//   const result = await notificationService.createNotification(
//     req.body.title,
//     req.body.description,
//     req.user.id
//   );
//   res.status(httpStatus.OK).json({ result });
// });

const fetchAllUsersNotification = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const filters = {};
  filters["userId"] = req.user.id;
  const result = await notificationService.fetchAllUsersNotification(
    page,
    limit,
    filters
  );
});

module.exports = {
  fetchAllUsersNotification,
};
