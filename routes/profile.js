const express = require("express");
const router = express.Router();
const User = require("../models/User");

//upsert : true

router.post("/edit/", (req, res, next) => {
  const location = { country: req.body.country, city: req.body.city };
  const { name, age, email, description } = req.body;
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      location,
      age,
      name,
      email,
      description,
      knownLanguages: req.body["known-languages"],
      learningLanguages: req.body["learning-languages"]
    },
    { new: true, runValidators: true }
  )
    .then(user => {
      res.redirect("/profile/");
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
      res.render("profile/edit", {
        user,
        userString: JSON.stringify(user)
      });
    }
  });
});

router.get("/:id?", (req, res, next) => {
  let id = req.user._id;

  if (req.params.id != null) {
    console.log("params != null");
    id = req.params.id;
  }
  User.findById(id, (error, user) => {
    if (error) {
      next(error);
    } else {
      if (user._id.equals(req.user._id)) {
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
