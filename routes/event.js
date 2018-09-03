const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

router.get("/", (req, res, next) => {
  Event.find((error, events) => {
    if (error) {
      next(error);
    } else {
      res.render("event/index", { events });
    }
  });
});

router.get("/find", (req, res, next) => {
  Event.find((error, events) => {
    if (error) {
      next(error);
    } else {
      res.render("event/find", { events });
    }
  });
});

router.get("/new", (req, res, next) => {
  res.render("event/new");
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
    },
    recurring: req.body.recurring
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
      res.render("event/show", { event });
    }
  });
});

router.post("/edit/:id", (req, res, next) => {
  console.log(req.body);
  Event.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
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
  //       event.recurring = req.body.recurring;
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
  Event.remove({ _id: req.params.id }, function(error, event) {
    if (error) {
      next(error);
    } else {
      res.redirect("/event");
    }
  });
});

router.get("/attend/:id", (req, res, next) => {
  // Todo
  res.redirect("/event");
  console.log("user attending event");
});

router.get("/unattend/:id", (req, res, next) => {
  // Todo
  res.redirect("/event");
  console.log("user unattending event");
});

module.exports = router;
