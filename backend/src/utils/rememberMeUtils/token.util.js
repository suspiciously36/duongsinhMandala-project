const utils = require("./randomString.util");

const tokens = {};

module.exports = {
  consumeRememberMeToken: (token, fn) => {
    var uid = tokens[token];
    // invalidate the single-use token
    delete tokens[token];
    return fn(null, uid);
  },

  saveRememberMeToken: (token, uid, fn) => {
    tokens[token] = uid;
    return fn();
  },

  issueToken: (user, done) => {
    var token = utils.randomString(64);
    saveRememberMeToken(token, user.id, function (err) {
      if (err) {
        return done(err);
      }
      return done(null, token);
    });
  },

  findById: (id, fn) => {
    var idx = id - 1;
    if (users[idx]) {
      fn(null, users[idx]);
    } else {
      fn(new Error("User " + id + " does not exist"));
    }
  },
};
