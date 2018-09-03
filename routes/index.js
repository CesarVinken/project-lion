const express = require("express");
const router = express.Router();

/* Lading Page */
router.get("/", (req, res, next) => {
  res.render("index");
  console.log(req.user);
});

module.exports = router;
