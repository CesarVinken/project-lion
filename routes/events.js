const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");
const cloud = require("../utils/cloudinary");

router.get("/", (req, res, next) => {
  Event.find({ attendees: req.user._id }, (error, events) => {
    if (error) {
      next(error);
    } else {
      res.render("events/index", { events, user: req.user });
    }
  });
});

router.get("/find", (req, res, next) => {
  Event.find((error, events) => {
    if (error) {
      next(error);
    } else {
      res.render("events/index", { events, user: req.user });
    }
  });
});

router.get("/new", (req, res, next) => {
  res.render("events/new", { user: req.user });
});

router.post("/new", (req, res, next) => {
  const pr = cloud.picUpload(req.files, "Event");
  pr.then(picture => {
    const newevent = new Event({
      title: req.body.title,
      description: req.body.description,
      language: req.body.language,
      date: req.body.date,
      user: req.user,
      location: {
        country: req.body.country,
        city: req.body.city,
        street: req.body.street
      },
      picture
    });
    newevent.save(error => {
      if (error) {
        next(error);
      } else {
        res.redirect("/events");
      }
    });
  });
});

router.get("/:id", (req, res, next) => {
  Event.findById(req.params.id, (error, event) => {
    if (error) {
      next(error);
    } else {
      console.log(event);
      if (event.attendees.indexOf(req.user._id) === -1) {
        event.userAttending = false;
      } else {
        event.userAttending = true;
      }
      res.render("events/show", { event, user: req.user });
    }
  });
});

router.post("/edits/:id", (req, res, next) => {
  console.log(req.body);
  req.body.location = {
    country: req.body.country,
    city: req.body.city,
    street: req.body.street
  };
  Event.findById(req.params.id, (error, event) => {
    if (error) {
      next(error);
    } else if (event.user === req.user._id) {
      next(new Error("Something went wrong"));
    } else {
      res.render("events/edit", { event });
    }
  });
  Event.findOneAndUpdate(
    { $and: [{ _id: req.params.id }, { user: req.user._id }] },
    req.body,
    {
      new: true,
      runValidators: true
    }
  )
    .then(event => {
      res.redirect("/events/" + req.params.id);
    })
    .catch(err => {
      console.log(err.message);
      next(err);
    });
  // Alternative
  //    const { title, cuisine, calories, type } = req.body
  //return Food.findOneAndUpdate({ index }, { title, cuisine, calories, type }, { new: true });

  //   Event.findById(req.params.id, (error, event) => {
  //     if (error) {
  //       next(error);
  //     } else {
  //       event.title = req.body.title;
  //       event.description = req.body.description;
  //       event.save(error => {
  //         if (error) {
  //           next(error);
  //         } else {
  //           res.redirect("/events/" + req.params.id);
  //         }
  //       });
  //     }
  //   });
});

router.get("/edit/:id", (req, res, next) => {
  Event.findById(req.params.id, (error, event) => {
    if (error) {
      next(error);
    } else {
      res.render("events/edit", { event, user: req.user });
    }
  });
});

router.get("/delete/:id", (req, res, next) => {
  User.findOneAndUpdate(
    { id: req.params.id },
    { $pull: { ownEvents: req.params.id } }
  );
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
    { $push: { attendees: req.user._id } },
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
    { $pull: { attendees: req.user._id } },
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
