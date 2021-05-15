const User = require("../models/User");

const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

//read and encode data from the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));

// create User with Passport
const createUser = (req, res) => {
  User.register(
    { username: req.body.username, email: req.body.email },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        // return res.render("../views/register.ejs")
        return res.send({ message: err });
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/");
        });
      }
    }
  );
};

const newUser = (req, res) => {
  res.render("../views/register.ejs");
};

const login = (req, res) => {
  console.log(req.user);
  res.render("../views/login.ejs");
};

const logout = (req, res) => {
  console.log(req.user);
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.redirect("/users/login");
    }
  });
};

module.exports = {
  logout,
  login,
  createUser,
  newUser,
};
