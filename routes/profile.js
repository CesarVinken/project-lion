const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/edit/", (req, res, next) => {
  req.body.location = { country: req.body.country, city: req.body.city };
  User.findOneAndUpdate({ _id: req.user._id }, req.body, { new: true, runValidators: true })
    .then(user => {
      res.redirect("/profile/" + req.user._id);
    })
    .catch(err => {
      console.log(err.message);
      next(err);
    });
});

router.get("/edit/", (req, res, next) => {
  console.log(req.user._id);
  User.findById(req.user._id, (error, user) => {
    if (error) {
      next(error);
    } else {
      res.render("profile/edit", { user });
    }
  });
});

router.get("/:id?", (req, res, next) => {
  let id = req.user._id;

  if (req.params.id != null) {
    id = req.params.id;
  }
  User.findById(id, (error, user) => {
    if (error) {
      next(error);
    } else {
      if (user._id === req.user._i) {
        user.ownProfile = true;
      }
      res.render("profile/show", { user });
    }
  });
});

router.get("/delete", (req, res, next) => {
  User.remove({ _id: req.user._id }, function(error, user) {
    if (error) {
      next(error);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
