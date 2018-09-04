const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");

router.get("/", (req, res, next) => {
  Event.find({ attendees: req.user._id }, (error, events) => {
    if (error) {
      next(error);
    } else {
      res.render("event/index", { events, name: req.user.name });
    }
  });
});

router.get("/find", (req, res, next) => {
  Event.find((error, events) => {
    if (error) {
      next(error);
    } else {
      res.render("event/index", { events });
    }
  });
});

router.get("/new", (req, res, next) => {
  res.render("event/new", { name: req.user.name });
});

router.post("/new", (req, res, next) => {
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
    }
  });
  newevent.save(error => {
    if (error) {
      next(error);
    } else {
      res.redirect("/event");
    }
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
      res.render("event/show", { event });
    }
  });
});

router.post("/edit/:id", (req, res, next) => {
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
      res.render("event/edit", { event });
    }
  });
  Event.findOneAndUpdate(
    { $and: [{ _id: req.params.id }, { user: req.user._id }] },
    req.body,
    {
      new: true
    }
  )
    .then(event => {
      res.redirect("/event/" + req.params.id);
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
  //           res.redirect("/event/" + req.params.id);
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
      res.render("event/edit", { event });
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
          res.redirect("/event");
        }
      });
    }
  );
});

router.get("/attend/:id", (req, res, next) => {
  Event.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { attendees: req.user._id } },
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
              res.redirect("/event/" + req.params.id);
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
              res.redirect("/event/" + req.params.id);
            }
          }
        );
      }
    }
  );
});

module.exports = router;
