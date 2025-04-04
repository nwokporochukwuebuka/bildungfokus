const crypto = require("crypto");

const generateStudentId = (name) => {
  const randomChars = crypto.randomBytes(2).toString("hex").toUpperCase(); // Generates 4 random characters
  const randomNumber = Math.floor(Math.random() * 90) + 10; // Generates a random number between 10 and 99

  return `${name}${randomChars}${randomNumber}`;
};

module.exports = {
  generateStudentId,
};
