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

const randomNumber = max => {
  return Math.floor(Math.random() * max);
};

module.exports = { checkAuthentication, checkLogout, randomNumber };
