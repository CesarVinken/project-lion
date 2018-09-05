const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/find", (req, res, next) => {
  User.find(
    {
      $and: [
        { _id: { $ne: req.user._id, $nin: req.user.blockedUsers } },
        { tandems: { $ne: req.user._id } }
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
      { tandems: { $ne: req.user._id } }
    ]
  };
  //if (req.body.country != "" || req.body.city != "") query.location = {};

  let maxAge = 100;
  const minAge = parseInt(req.body.ageStart);
  if (req.body.ageEnd !== "") {
    maxAge = parseInt(req.body.ageEnd);
  }
  query.age = { $gte: minAge, $lte: maxAge };
  if (req.body.language !== "") {
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

  User.find({ tandems: req.user._id }, (error, tandems) => {
    if (error) {
      next(error);
    } else {
      if (req.params.id != null) {
        User.findById(req.params.id).then(tandem => {
          current = tandem;
          res.render("tandems/index", { tandems, current, user: req.user });
        });
      } else {
        current = tandems[0];
        res.render("tandems/index", { tandems, current, user: req.user });
      }
    }
  });
});

router.get("/add/:id", (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { tandems: req.user._id } }
  )
    .then(user => {
      return User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { tandems: req.params.id } }
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
      $pull: { tandems: req.params.id }
    }
  )
    .then(user => {
      return User.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { tandems: req.user._id } }
      );
    })
    .then(user => {
      res.redirect("/tandems/");
    });
});

module.exports = router;
