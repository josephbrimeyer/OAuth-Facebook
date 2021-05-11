const express = require("express");
const mongoose = require("mongoose");
passport = require("passport");
localStrategy = require("passport-local");
passportLocalMongoose = require("passport-local-mongoose");

const methodOverride = require("method-override");
const session = require("express-session");
var bodyParser = require("body-parser");

const db = require("./models/index.js");
const User = require("./models/User.js");

require("dotenv").config();
const PORT = process.env.PORT || 3001;
const app = express();

//middleware
app.set("view engine", "ejs");

//User session
app.use(
  session({
    secret: "parti-app",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(methodOverride("_method"));

// parse incoming data into a JS object attached to the request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// FacebookStrategy within Passport
// code goes here ......

//homepage route
app.get("/", (req, res) => {
  res.send("Facebook-OAuth homepage");
});

// routes
const userRouter = require("./routes/users.js");
app.use("/users", userRouter);

// Server connection.
app.listen(PORT, () => {
  console.log(`🌎 ==> Server is now listening on port ${PORT}!`);
});
