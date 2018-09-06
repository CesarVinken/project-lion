const User = require("../models/User");

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

function checkLogout(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    next();
  }
}

const randomNumber = max => {
  return Math.floor(Math.random() * max);
};

const updateActivity = (req, res, next) => {
  const date = new Date();
  User.findByIdAndUpdate({ _id: req.user._id }, { lastActivity: date })
    .then(result => next())
    .catch(err => console.log(err));
};

module.exports = { checkAuthentication, checkLogout, randomNumber, updateActivity };
