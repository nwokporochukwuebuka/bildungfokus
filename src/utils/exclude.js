function exclude(user, keys) {
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    delete user[key];
  }
  return user;
}

module.exports = exclude; // Export the function for use in other files
