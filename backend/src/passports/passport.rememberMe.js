// const RememberMeStrategy = require("@jmilanes/passport-remember-me").Strategy;
// const { User } = require("../models/index");
// module.exports = new RememberMeStrategy(
//   {
//     // A unique salt string is the only required parameter, it is
//     // used to create the tokens and makes them more secure.
//     salt: "alsdhad876tasd8adgiasdghasd8",
//   },
//   async (userId, token, done) => {
//     const user = await User.findOne({
//       where: { remembered: true, id: userId, remember_token: token },
//     });
//     if (!user) {
//       return done(null, false);
//     }
//     await User.update(
//       { remembered: false },
//       { where: { id: userId, remember_token: token } }
//     );
//     return done(null, user);
//   },
//   async (token, userId, done) => {
//     await User.update(
//       { remembered: true },
//       { where: { id: userId, remember_token: token } }
//     );
//     return done();
//   }
// );
