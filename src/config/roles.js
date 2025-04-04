const allRoles = {
  user: [],
  // admin: ['getUsers', 'manageUsers'],
  parent: ["parent"],
  student: ["student"],
  teacher: ["teacher"],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
