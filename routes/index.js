const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Event = require("../models/Event");

router.get("/", (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log("hello");
    res.render("index");
  } else {
    const picture = "https://picsum.photos/200/300/?random";

    Promise.all([
      User.find({ tandems: req.user._id })
        .sort({ name: -1 })
        .limit(3),
      User.count({ tandems: req.user._id }),
      Event.find({ attendees: req.user._id })
        .sort({ date: 1 })
        .limit(3),
      Event.count({ tandems: req.user._id })
    ]).then(values => {
      let tandemsMore = false;
      let eventsMore = false;
      if (values[1] > 3) {
        tandemsMore = true;
      }
      if (values[3] > 3) {
        eventsMore = true;
      }
      res.render("dashboard", {
        tandems: values[0],
        tandemsMore,
        events: values[2],
        eventsMore,
        picture,
        user: req.user
      });
    });
  }
});
module.exports = router;
