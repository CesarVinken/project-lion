const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const Util = require("../utils/util");
const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    (username, password, next) => {
      User.findOne({ email: username }, (err, foundUser) => {
        if (err) {
          next(err);
          return;
        }

        if (!foundUser) {
          next(null, false, { message: "Incorrect email" });
          return;
        }

        if (!bcrypt.compareSync(password, foundUser.password)) {
          next(null, false, { message: "Incorrect password" });
          return;
        }
        next(null, foundUser);
      });
    }
  )
);
