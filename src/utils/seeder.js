// const subjectList
// seed the creation of subjects

const { db } = require("../models");
const gradeList = require("./grade-list");
const subjectList = require("./subject-list");

module.exports.seedSubjects = async () => {
  setTimeout(() => {
    subjectList.forEach(async (subject) => {
      // check first
      const check = await db.subject.findOne({ where: { slug: subject.slug } });

      if (!check) {
        await db.subject.create({ name: subject.name, slug: subject.slug });
        return;
      }
      return;
    });
  }, 2000);
};

module.exports.seedGrade = async () => {
  setTimeout(() => {
    gradeList.forEach(async (grade) => {
      const check = await db.grade.findOne({ where: { slug: grade.slug } });

      if (!check) {
        await db.grade.create({ name: grade.name, slug: grade.slug });
        return;
      }
      return;
    });
  }, 3000);
};
