const { User, Provider } = require("../models/index");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
module.exports = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    const provider = await Provider.findOne({ where: { name: "localEmail" } });
    const user = await User.findOne({
      where: { email, provider_id: provider.id },
    });
    if (!user) {
      return done(null, false, {
        message: "Account does not exists.",
      });
    }
    if (!user.dataValues.status) {
      return done(null, false, {
        message: "Account has not activated yet.",
      });
    }
    const result = bcrypt.compareSync(password, user.password);
    if (!result) {
      return done(null, false, {
        message: "Wrong password.",
      });
    }
    return done(null, user);
  }
);
