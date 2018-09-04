function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

function checkLogout(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    next();
  }
}
module.exports = { checkAuthentication, checkLogout };
