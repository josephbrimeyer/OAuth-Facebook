const express = require("express");
const app = express();
passport = require("passport");
localStrategy = require("passport-local");
passportLocalMongoose = require("passport-local-mongoose");
FacebookStrategy = require("passport-facebook").Strategy;

const User = require("../models/User");

// Facebook Strategy within Passport
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["email", "name"],
    },
    function (accessToken, refreshToken, profile, done) {
      const { email, first_name, last_name } = profile._json;
      const userData = {
        email,
        firstName: first_name,
        lastName: last_name,
      };
      new userModel(userData).save();
      done(null, profile);
      console.log(accessToken);
      console.log(refreshToken);
      console.log(profile);
    }
  )
);

// passport callback function
//check if user already exists in our db with the given profile ID
User.findOrCreate({ facebookId: profile.id }).then((currentUser) => {
  if (currentUser) {
    console.log(profile);
    //if we already have a record with the given profile ID
    done(null, currentUser);
  } else {
    //if not, create a new user
    user = new User({
      username: profile.displayName,
      email: profile.emails[0].value,
      facebookId: profile.id,
    });
    user.save(function (err) {
      if (err) console.log(err);
      return done(null, user);
    });
  }
});

//read and encode data from the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

module.exports = { passport };
