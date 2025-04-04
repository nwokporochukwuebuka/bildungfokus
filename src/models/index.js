const Sequelize = require("sequelize");
const { sequelize } = require("../config/config");
const logger = require("../config/logger");

const sequelizeInstance = new Sequelize(sequelize.url);
const db = {};

/* const sequelizeInstance = new Sequelize(
  sequelize.database,
  sequelize.user,
  sequelize.password,
  {
    host: sequelize.host,
    dialect: sequelize.dialect,
    pool: {
      min: 0,
      max: 100,
      acquire: 5000,
      Idle: 1000,
    },
  }
);
 */
sequelizeInstance
  .authenticate()
  .then(() => logger.info("DB connected"))
  .catch((err) => {
    logger.error(err);
  });

db.sequelize = sequelizeInstance;
db.Sequelize = Sequelize;

db.users = require("./user.model")(sequelizeInstance, Sequelize);
db.tokens = require("./token.model")(sequelizeInstance, Sequelize);
db.notification = require("./notification.model")(sequelizeInstance, Sequelize);
db.teacher = require("./teacher.model")(sequelizeInstance, Sequelize);
db.student = require("./student.model")(sequelizeInstance, Sequelize);
db.studentTeacher = require("./student-teacher.model")(
  sequelizeInstance,
  Sequelize
);
db.studentParent = require("./student-parent.model")(
  sequelizeInstance,
  Sequelize
);
db.grade = require("./grade.model")(sequelizeInstance, Sequelize);
db.parent = require("./parent.model")(sequelizeInstance, Sequelize);
db.subject = require("./subject.model")(sequelizeInstance, Sequelize);
db.assignment = require("./assignment.model")(sequelizeInstance, Sequelize);
db.topic = require("./topic.model")(sequelizeInstance, Sequelize);
db.question = require("./question.model")(sequelizeInstance, Sequelize);
db.option = require("./option.model")(sequelizeInstance, Sequelize);
db.studentAssignment = require("./student-assignment.model")(
  sequelizeInstance,
  Sequelize
);
db.studentAssignmentAnswer = require("./student-answer.model")(
  sequelizeInstance,
  Sequelize
);
// relationships for models

//= ==============================
// Define all relationships here below
//= ==============================
// db.User.hasMany(db.Role);
// db.Role.belongsTo(db.User);

// all users and notifications
db.users.hasMany(db.notification, { foreignKey: "userId" });
db.notification.belongsTo(db.users, { foreignKey: "userId" });

// user type relationships
db.users.hasOne(db.student, { through: "userId" });
db.student.belongsTo(db.users, { through: "userId" });

db.users.hasOne(db.teacher, { through: "userId" });
db.teacher.belongsTo(db.users, { through: "userId" });

db.users.hasOne(db.parent, { through: "userId" });
db.parent.belongsTo(db.users, { through: "userId" });

// teacher and student
db.student.belongsToMany(db.teacher, {
  through: db.studentTeacher,
  foreignKey: "studentId",
});
db.teacher.belongsToMany(db.student, {
  through: db.studentTeacher,
  foreignKey: "teacherId",
});

// Parent and student
db.student.belongsToMany(db.parent, {
  through: db.studentParent,
  foreignKey: "studentId",
});
db.parent.belongsToMany(db.student, {
  through: db.studentParent,
  foreignKey: "parentId",
});

db.studentParent.belongsTo(db.student, {
  foreignKey: "studentId",
});
db.studentParent.belongsTo(db.parent, {
  foreignKey: "teacherId",
});

db.student.belongsToMany(db.assignment, {
  through: db.studentAssignment,
  foreignKey: "parentId",
});
db.assignment.belongsToMany(db.student, {
  through: db.studentAssignment,
  foreignKey: "assignnmentId",
});

db.studentAssignment.belongsTo(db.student, { foreignKey: "studentId" });
db.student.hasMany(db.studentAssignment, { foreignKey: "studentId" });

db.studentAssignment.belongsTo(db.assignment, {
  foreignKey: "assignmentId",
});
db.assignment.hasMany(db.studentAssignment, { foreignKey: "assignmentId" });

db.studentTeacher.belongsTo(db.student, {
  foreignKey: "studentId",
});
db.studentTeacher.belongsTo(db.teacher, {
  foreignKey: "teacherId",
});

db.subject.hasMany(db.assignment, { foreignKey: "subjectId" });
db.assignment.belongsTo(db.subject, { foreignKey: "subjectId" });

db.grade.hasMany(db.assignment, { foreignKey: "gradeId" });
db.assignment.belongsTo(db.grade, { foreignKey: "gradeId" });

db.topic.hasMany(db.assignment, { foreignKey: "topicId" });
db.assignment.belongsTo(db.topic, { foreignKey: "topicId" });

db.subject.hasMany(db.topic, { foreignKey: "subjectId" });
db.topic.belongsTo(db.subject, { foreignKey: "subjectId" });

db.assignment.hasMany(db.question, { foreignKey: "assignmentId" });
db.question.belongsTo(db.assignment, { foreignKey: "assignmentId" });

db.question.hasMany(db.option, { foreignKey: "questionId" });
db.option.belongsTo(db.question, { foreignKey: "questionId" });

db.teacher.hasMany(db.assignment, { foreignKey: "teacherId" });
db.assignment.belongsTo(db.teacher, { foreignKey: "teacherId" });

// StudentAssignmentAnswer relationships
db.student.hasMany(db.studentAssignmentAnswer, { foreignKey: "studentId" });
db.studentAssignmentAnswer.belongsTo(db.student, { foreignKey: "studentId" });

db.question.hasMany(db.studentAssignmentAnswer, { foreignKey: "questionId" });
db.studentAssignmentAnswer.belongsTo(db.question, { foreignKey: "questionId" });

db.option.hasMany(db.studentAssignmentAnswer, { foreignKey: "optionId" });
db.studentAssignmentAnswer.belongsTo(db.option, { foreignKey: "optionId" });

db.assignment.hasMany(db.studentAssignmentAnswer, {
  foreignKey: "assignmentId",
});
db.studentAssignmentAnswer.belongsTo(db.assignment, {
  foreignKey: "assignmentId",
});

// Also connect it to studentAssignment if you want to track which attempt this belongs to
db.studentAssignment.hasMany(db.studentAssignmentAnswer, {
  foreignKey: "studentAssignmentId",
});
db.studentAssignmentAnswer.belongsTo(db.studentAssignment, {
  foreignKey: "studentAssignmentId",
});

module.exports = {
  db,
};
