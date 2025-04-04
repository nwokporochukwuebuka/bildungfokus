const userTypes = {
  PARENT: "parent",
  STUDENT: "student",
  TEACHER: "teacher",
};

const studentStatusAssignment = {
  PENDING: "pending",
  SUBMITTED: "submitted",
  CANCELLED: "canceled",
  GRADED: "graded",
  IN_PROGRESS: "in-progress",
};

const assignmentStatus = {
  PENDING: "pending",
  ASSIGNED: "assigned",
  DUE: "due",
  CANCELLED: "cancelled",
};

module.exports = {
  userTypes,
  studentStatusAssignment,
  assignmentStatus,
};
