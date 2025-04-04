const studentService = require("../services/student.service");
const studentAssignmentService = require("../services/student-assignment.service");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const { studentStatusAssignment } = require("../config/enums");

const assignmentEligibility = async (req, res, next) => {
  try {
    // Fetch the student credentials
    const student = await studentService.getStudentByUserId(req.user.id);
    if (!student) {
      return next(new ApiError(httpStatus.NOT_FOUND, "Student not found"));
    }

    // Fetch the assignment and check if it's assigned to the student
    const { assignmentId } = req.params;

    const studentAssignment =
      await studentAssignmentService.fetchStudentAssignment(
        student.dataValues.id,
        assignmentId
      );

    if (!studentAssignment) {
      return next(
        new ApiError(
          httpStatus.FORBIDDEN,
          "This assignment was not assigned to this student"
        )
      );
    }

    if (
      studentAssignment.dataValues.status === studentStatusAssignment.SUBMITTED
    ) {
      return next(
        new ApiError(
          httpStatus.FORBIDDEN,
          "This assignment has been submitted already"
        )
      );
    }
    if (
      studentAssignment.dataValues.status === studentStatusAssignment.CANCELLED
    ) {
      return next(
        new ApiError(
          httpStatus.FORBIDDEN,
          "This assignment has been cancelled already"
        )
      );
    }
    if (
      studentAssignment.dataValues.status === studentStatusAssignment.GRADED
    ) {
      return next(
        new ApiError(
          httpStatus.FORBIDDEN,
          "This assignment has been graded already"
        )
      );
    }
    if (
      studentAssignment.dataValues.status === studentStatusAssignment.PENDING
    ) {
      return next(
        new ApiError(
          httpStatus.FORBIDDEN,
          "Student has not started the assignment"
        )
      );
    }

    // Compare the due date with the current time
    const now = new Date();
    const dueDate = new Date(studentAssignment.dataValues.dueDate);

    console.log({ now, dueDate });

    if (now > dueDate) {
      // changed the assignment status to submitted
      console.log("User is not eligible to answer questions");
      return next(
        new ApiError(httpStatus.BAD_REQUEST, "Assignment has passed due date")
      );
    }

    console.log("User is eligible to answer questions");
    next(); // Move to the next middleware if eligible
  } catch (error) {
    console.error("Error in assignmentEligibility middleware:", error);
    next(error); // Pass error to Express error handler
  }
};

module.exports = assignmentEligibility;

/* studentStatusAssignment */
