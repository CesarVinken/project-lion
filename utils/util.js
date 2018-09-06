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

const updateActivity = (id1, id2) => {
  console.log("id1: " + id1 + " -id2: " + id2);
  const date = new Date();
  User.findOneAndUpdate(
    { _id: id1, "tandems.user": id2 },
    { $set: { "tandems.$.lastActivity": date } }
  ).catch(err => console.log(err));
};

module.exports = { checkAuthentication, checkLogout, randomNumber, updateActivity };
