const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/find", (req, res, next) => {
  User.find(
    {
      $and: [
        { _id: { $ne: req.user._id, $nin: req.user.blockedUsers } },
        { "tandems.user": { $ne: req.user._id } }
      ]
    },
    (error, tandems) => {
      if (error) {
        next(error);
      } else {
        res.render("tandems/find", {
          tandems,
          user: req.user,
          userString: JSON.stringify(req.user)
        });
      }
    }
  );
});

router.post("/find", (req, res, next) => {
  let query = {
    $and: [
      { _id: { $ne: req.user._id, $nin: req.user.blockedUsers } },
      { "tandems.user": { $ne: req.user._id } }
    ]
  };

  let maxAge = 100;
  let minAge = 18;
  if (req.body.ageEnd !== "") {
    maxAge = parseInt(req.body.ageEnd);
  }
  if (req.body.ageStart !== "") {
    minAge = parseInt(req.body.ageStart);
  }
  query.age = { $gte: minAge, $lte: maxAge };
  console.log(req.body);
  if (req.body.language != undefined && typeof req.body.language !== "string") {
    query.knownLanguages = { $in: req.body.language };
  } else if (req.body.language != undefined) {
    query.knownLanguages = req.body.language;
  }
  if (req.body.country !== "") {
    query["location.country"] = req.body.country;
  }
  if (req.body.city !== "") {
    query["location.city"] = req.body.city;
  }
  console.log(query);
  User.find(query, (error, tandems) => {
    if (error) {
      next(error);
    } else {
      res.render("tandems/find", { tandems, user: req.user });
    }
  });
});

router.get("/:id?", (req, res, next) => {
  let current = {};

  User.findById(req.user._id)
    .populate("tandems.user")
    // .sort([["lastActivity", -1]])
    .then(user => {
      let tandems = user.tandems;
      console.log(tandems);
      if (req.params.id != null) {
        for (let tandem of tandems) {
          if (tandem.user._id == req.params.id) {
            tandem.user.selected = true;
            current = tandem;
          }
        }
        console.log("current", current);
        res.render("tandems/index", { tandems, current, user: req.user });
      } else {
        if (tandems.length > 0) {
          tandems[0].user.selected = true;
          current = tandems[0];
        }

        res.render("tandems/index", { tandems, current, user: req.user });
      }
    })
    .catch(err => next(err));
});

router.get("/add/:id", (req, res, next) => {
  const date = new Date();
  User.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { tandems: { user: req.user._id, lastActivity: date } } }
  )
    .then(user => {
      return User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { tandems: { user: req.params.id, lastActivity: date } } }
      );
    })
    .then(user => {
      res.redirect("/tandems/" + req.params.id);
    })
    .catch(error => {
      next(error);
    });
});

router.get("/block/:id", (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $push: { blockedUsers: req.params.id },
      $pull: { tandems: { user: req.params.id } }
    }
  )
    .then(user => {
      return User.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { tandems: { _id: req.user._id } } }
      );
    })
    .then(user => {
      res.redirect("/tandems/");
    });
});

module.exports = router;
