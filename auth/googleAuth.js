const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "https://healthy-leg-warmers-bull.cyclic.app/api/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      const user = {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
      };
      cb(null, { data: user });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
