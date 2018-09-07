const express = require("express");
const moment = require("moment");
const router = express.Router();
const User = require("../models/User");
const Event = require("../models/Event");
const Util = require("../utils/util");

router.get("/", (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.render("index");
  } else {
    const picture = "/images/dashboard-background-" + Util.randomNumber(4) + ".jpg";

    Promise.all([
      User.findById(req.user._id).populate("tandems.user"),
      Event.find({ attendees: req.user._id })
        .sort({ date: 1 })
        .limit(3),
      Event.count({ attendees: req.user._id })
    ]).then(values => {
      console.log(values);
      let tandems = values[0].tandems.sort((a, b) => a.lastActivity < b.lastActivity);
      tandems = tandems.slice(0, 3);
      tandems = tandems.map(el => {
        el.dateStr = moment(el.lastActivity).format("ddd h:mm");
        return el;
      });
      let tandemsMore = false;
      let eventsMore = false;
      if (values[0].tandems.length > 3) {
        tandemsMore = true;
      }
      if (values[2] > 3) {
        eventsMore = true;
      }
      res.render("dashboard", {
        tandems,
        tandemsMore,
        events: values[1],
        eventsMore,
        picture,
        user: req.user
      });
    });
  }
});
module.exports = router;
