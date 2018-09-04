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
        res.render("tandems/find", { tandems, user: req.user });
      }
    }
  );
});

router.post("/find", (req, res, next) => {
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
        res.render("tandems/find", { tandems, user: req.user });
      }
    }
  );
});

router.get("/:id?", (req, res, next) => {
  User.find({ tandems: req.user._id }, (error, tandems) => {
    if (error) {
      next(error);
    } else {
      res.render("tandems/index", { tandems, user: req.user });
    }
  });
});

router.get("/add/:id", (req, res, next) => {
  User.findOneAndUpdate({ _id: req.params.id }, { $push: { tandems: req.user._id } })
    .then(user => {
      return User.findOneAndUpdate({ _id: req.user._id }, { $push: { tandems: req.params.id } });
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
      return User.findOneAndUpdate({ _id: req.params.id }, { $pull: { tandems: req.user._id } });
    })
    .then(user => {
      res.redirect("/tandems/");
    });
});

module.exports = router;
