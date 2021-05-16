const express = require("express");
const mongoose = require("mongoose");
passport = require("passport");
localStrategy = require("passport-local");
passportLocalMongoose = require("passport-local-mongoose");
FacebookStrategy = require("passport-facebook").Strategy;

const methodOverride = require("method-override");
const session = require("express-session");
var bodyParser = require("body-parser");

const db = require("./models/index.js");
const User = require("./models/User.js");

require("dotenv").config();
const PORT = process.env.PORT || 3001;
const app = express();

app.use(methodOverride("_method"));

// parse incoming data into a JS object attached to the request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// FacebookStrategy within Passport
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3001/auth/facebook/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      // passport callback function
      //check if user already exists in our db with the given profile ID
      User.findOne({ facebookId: profile.id }).then((currentUser) => {
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
    }
  )
);

// Facebook route middleware.
app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

// Configure view engine to render EJS templates.
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

//read and encode data from the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findOne(id).then((user) => {
    done(null, user);
  });
});

// Define routes.
app.get("/", function (req, res) {
  res.render("home", { user: req.user });
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/login/facebook", passport.authenticate("facebook"));

app.get(
  "/return",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

app.get(
  "/profile",
  require("connect-ensure-login").ensureLoggedIn(),
  function (req, res) {
    res.render("profile", { user: req.user });
  }
);

// Server connection.
app.listen(PORT, () => {
  console.log(`🌎 ==> Server is now listening on port ${PORT}!`);
});
