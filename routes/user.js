const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const user = require("../models/user");
const passport = require("passport");
const userController = require("../controller/user");
const { getLocation } = require("../middleware");

router.use((req, res, next)=>{
  if(req.session.requestedUrl)
  {
    res.locals.requestedUrl = req.session.requestedUrl;
  }
  else
  {
    res.locals.requestedUrl = "/listings";
  }
  next();
})

router.get("/signup", userController.signUpRoute);

router.post("/signup", wrapAsync(userController.signUp));

router.get("/login", userController.loginRoute);

router.post("/login", passport.authenticate('local', { failureRedirect: "/user/login", failureFlash: true}), userController.login);

router.get("/logout", userController.logout);

module.exports = router;  