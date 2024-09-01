module.exports.isLoggedIn = (req, res, next)=>{
  if(!req.isAuthenticated())
  {
    req.session.requestedUrl = req.originalUrl;
    req.flash("error", "You must be logged in to add an item.");
    res.redirect("/user/login");
  }
  else
  next();
}
