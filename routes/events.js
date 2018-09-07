const express = require("express");
const moment = require("moment");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");
const cloud = require("../utils/cloudinary");

router.get("/", (req, res, next) => {
  Event.find({ attendees: req.user._id }, (error, events) => {
    if (error) {
      next(error);
    } else {
      for (const event of events) {
        if (event.user.equals(req.user._id)) {
          event.own = true;
        }
      }
      res.render("events/index", { events, user: req.user });
    }
  });
});

router.get("/find", (req, res, next) => {
  Event.find({})
    .sort([["date", -1]])
    .limit(25)
    .then(events => {
      res.render("events/find", {
        events,
        user: req.user,
        userString: JSON.stringify(req.user)
      });
    })
    .catch(err => next(err));
});

router.post("/find", (req, res, next) => {
  console.log(req.body);
  let query = {
    //attendees: { $ne: req.user._id }
  };
  let minDate = new Date();
  minDate.setHours(0, 0, 0, 0);
  let maxDate = new Date(minDate.getFullYear() + 1, minDate.getMonth(), minDate.getDay());

  if (req.body.minDate !== "") {
    minDate = req.body.minDate;
  }
  if (req.body.maxDate !== "" && req.body.maxDate >= minDate) {
    maxDate = req.body.maxDate;
  }
  query.date = { $gte: minDate, $lte: maxDate };
  if (req.body.language !== undefined) {
    query.language = { $in: req.body.language };
  }
  if (req.body.country !== "") {
    query["location.country"] = req.body.country;
  }
  if (req.body.city !== "") {
    query["location.city"] = req.body.city;
  }
  console.log(query);
  Event.find(query)
    .sort([["date", -1]])
    .limit(25)
    .then(events => {
      res.render("events/find", { events, user: req.user, userString: JSON.stringify(req.user) });
    })
    .catch(err => next(err));
});
router.get("/new", (req, res, next) => {
  res.render("events/new", {
    user: req.user,
    dataString: JSON.stringify({ user: req.user })
  });
});

router.post("/new", (req, res, next) => {
  const pr = cloud.picUpload(req.files, "Event");
  pr.then(picture => {
    return new Event({
      title: req.body.title,
      description: req.body.description,
      language: req.body.language,
      date: req.body.date,
      dateStr: moment(req.body.date).format("ddd DD/MM/YYYY"),
      user: req.user,
      attendees: [req.user._id],
      location: {
        country: req.body.country,
        city: req.body.city,
        street: req.body.street
      },
      picture
    }).save();
  })
    .then(event => {
      User.findOneAndUpdate({ _id: req.user._id }, { $push: { events: event._id } });
      return event;
    })
    .then(event => {
      res.redirect("/events/" + event._id);
    })
    .catch(error => {
      next(error);
    });
});

router.get("/:id", (req, res, next) => {
  Event.findById(req.params.id, (error, event) => {
    if (error) {
      next(error);
    } else {
      if (event.attendees.indexOf(req.user._id) === -1) {
        event.userAttending = false;
      } else {
        event.userAttending = true;
      }

      if (event.user.equals(req.user._id)) {
        event.own = true;
      }
      if (event.attendees.indexOf(req.user._id) === -1) {
        event.attending = true;
      }
      res.render("events/show", {
        event,
        user: req.user,
        eventString: JSON.stringify(event)
      });
    }
  });
});

router.post("/edit/:id", (req, res, next) => {
  const pr = cloud.picUpload(req.files, "Event");
  pr.then(picture => {
    req.body.location = {
      country: req.body.country,
      city: req.body.city,
      street: req.body.street
    };

    if (picture !== "/images/placeholderEvent.png") {
      req.body.picture = picture;
    }
    req.body.dateStr = moment(req.body.date).format("ddd DD/MM/YYYY");
    Event.findOneAndUpdate({ $and: [{ _id: req.params.id }, { user: req.user._id }] }, req.body, {
      new: true,
      runValidators: true
    })
      .then(event => {
        res.redirect("/events/" + req.params.id);
      })
      .catch(err => {
        console.log(err.message);
        next(err);
      });
  });
});

router.get("/edit/:id", (req, res, next) => {
  Event.findById(req.params.id, (error, event) => {
    if (error) {
      next(error);
    } else {
      res.render("events/edit", {
        event,
        user: req.user,
        dataString: JSON.stringify({ event, user: req.user })
      });
    }
  });
});

router.get("/delete/:id", (req, res, next) => {
  User.findOneAndUpdate({ id: req.params.id }, { $pull: { ownEvents: req.params.id } });
  User.update(
    { events: req.params.id },
    { $pull: { events: req.params.id } },
    { new: true },
    (error, users) => {
      console.log(users);
      Event.remove({ _id: req.params.id }, function(error, event) {
        if (error) {
          next(error);
        } else {
          res.redirect("/events");
        }
      });
    }
  );
});

router.get("/attend/:id", (req, res, next) => {
  Event.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { attendees: req.user._id }, $inc: { counter: 1 } },
    { runValidators: true },
    (error, event) => {
      if (error) {
        next(error);
      } else {
        User.findOneAndUpdate(
          { _id: req.user._id },
          { $push: { events: req.params.id } },
          (error, event) => {
            if (error) {
              next(error);
            } else {
              res.redirect("/events/" + req.params.id);
            }
          }
        );
      }
    }
  );
});

router.get("/unattend/:id", (req, res, next) => {
  Event.findOneAndUpdate(
    { _id: req.params.id },
    { $pull: { attendees: req.user._id }, $inc: { counter: -1 } },
    { runValidators: true },
    (error, event) => {
      if (error) {
        next(error);
      } else {
        User.findOneAndUpdate(
          { _id: req.user._id },
          { $pull: { events: req.params.id } },
          (error, event) => {
            if (error) {
              next(error);
            } else {
              res.redirect("/events/" + req.params.id);
            }
          }
        );
      }
    }
  );
});

module.exports = router;
