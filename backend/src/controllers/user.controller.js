const userRequest = require("../requests/user.request");
module.exports = {
  store(req, res) {
    const body = userRequest.validate(req.body);
  },
};
