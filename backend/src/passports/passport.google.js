var GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Provider, User } = require("../models/index");
module.exports = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    scope: ["email", "profile"],
  },
  async (accessToken, refreshToken, profile, done) => {
    const {
      displayName: name,
      emails: [{ value: email }],
    } = profile;
    const [provider] = await Provider.findOrCreate({
      where: { name: "google" },
      defaults: {
        name: "google",
      },
    });
    const [user] = await User.findOrCreate({
      where: { email, provider_id: provider.id },
      defaults: { name, email, status: true, provider_id: provider.id },
    });
    done(null, user);
  }
);
