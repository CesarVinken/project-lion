const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Event = require("../models/Event");

router.get("/", (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.render("index");
  }
  const picture = "https://picsum.photos/200/300/?random";

  // const tandems = User.find({ tandems: req.user._id });
  // const events = Even.find({ attendees: req.user._id });
  // Promise.all()

  // User.find({ tandems: req.user._id })
  //   .then(tandems => {
  //     return Even.find({ attendees: req.user._id });
  //   })
  //   .then(events => {
  //     res.render("dashboard", { events, tandems });
  //   });

  Promise.all([
    User.find({ tandems: req.user._id })
      .sort({ name: -1 })
      .limit(3),
    Event.find({ attendees: req.user._id })
      .sort({ date: 1 })
      .limit(3)
  ]).then(values => {
    res.render("dashboard", { tandems: values[0], events: values[1], picture });
  });
});
module.exports = router;
