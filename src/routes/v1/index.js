const express = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const docsRoute = require("./docs.route");
const notificationRoute = require("./notification.route");
const teacherRoute = require("./teacher.route");
const config = require("../../config/config");
const assignmentRoute = require("./assignment.route");
const questionRoute = require("./question.route");
const gradeRoute = require("./grade.route");
const subjectRoute = require("./subject.route");
const topicRoute = require("./topic.route");
const studentRoute = require("./student.route");
const parentRoute = require("./parent.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/notification",
    route: notificationRoute,
  },
  {
    path: "/teacher",
    route: teacherRoute,
  },
  {
    path: "/assignment",
    route: assignmentRoute,
  },
  {
    path: "/questions",
    route: questionRoute,
  },
  {
    path: "/grade",
    route: gradeRoute,
  },
  {
    path: "/subject",
    route: subjectRoute,
  },
  {
    path: "/topic",
    route: topicRoute,
  },
  {
    path: "/student",
    route: studentRoute,
  },
  {
    path: "/parent",
    route: parentRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
