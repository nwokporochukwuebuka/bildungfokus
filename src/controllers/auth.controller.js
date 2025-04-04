const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  authService,
  userService,
  tokenService,
  emailService,
  parentService,
  studentService,
  teacherService,
} = require("../services");
const { userTypes } = require("../config/enums");
const exclude = require("../utils/exclude");

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  // console.log({ user });
  let parent, student, teacher;
  if (req.body.role && req.body.role === userTypes.PARENT) {
    parent = await parentService.createParent(user.id);
  } else if (req.body.role && req.body.role === userTypes.STUDENT) {
    student = await studentService.createStudent(user.id, user.username);
  } else if (req.body.role && req.body.role === userTypes.TEACHER) {
    teacher = await teacherService.createTeacher(user.id);
  }
  const tokens = await tokenService.generateAuthTokens(user.id);
  const userWIthType = await userService.getUserWithUserType(
    user.id,
    req.body.role
  );
  return res
    .status(httpStatus.CREATED)
    .send({ user: exclude(userWIthType.dataValues, ["password"]), tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user.id);
  const userWithType = await userService.getUserWithUserType(
    user.id,
    user.role
  );
  res.send({ user: exclude(userWithType.dataValues, ["password"]), tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  if (process.env.NODE_ENV === "production") {
    await emailService.sendResetPasswordEmail(
      req.body.email,
      resetPasswordToken
    );
    return res.status(httpStatus.NO_CONTENT).send();
  }
  return res.status(httpStatus.OK).json({ resetPasswordToken });
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user
  );

  if (process.env.NODE_ENV !== "production") {
    return res.status(httpStatus.OK).json({ verifyEmailToken });
  }
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  return res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
