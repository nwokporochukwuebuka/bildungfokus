const express = require("express");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const { userTypes } = require("../../config/enums");
const notificationController = require("../../controllers/notification.controller");

const router = express.Router();

// router.post("/", auth(userTypes.))

router.get("/", auth(), notificationController.fetchAllUsersNotification);

module.exports = router;
