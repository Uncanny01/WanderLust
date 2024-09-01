const user = require("../models/user");
const axios = require("axios");

module.exports.signUpRoute = (req, res)=>{
  res.render("signup");
}

module.exports.signUp = async(req, res)=>{
  let {username, email, password} = req.body;
  const newUser = new user({ username, email });
  const registeredUser = await user.register(newUser, password);
  req.login(registeredUser, (err)=>{
    req.flash("success", "Logged in successfully");
    res.redirect(res.locals.requestedUrl);
  })
}

// module.exports.getCurrentLocation = (req, res)=>{
//   const { latitude, longitude } = req.body;

//   req.session.latitude = latitude;
//   req.session.longitude = longitude;
//   res.redirect("/login");
// }

module.exports.loginRoute = (req, res)=>{
  res.render("login");
}

module.exports.login = async(req, res)=>{
  req.flash("success", "Logged in successfully!");
  res.redirect(res.locals.requestedUrl);
}

module.exports.logout = (req, res, next)=>{
  if(req.isAuthenticated())
  {
    req.logout((err)=>{
      if(err)
      {
        return next(err);
      }
      req.flash("success", "Logged out successfully!");
      res.redirect("/listings");
    })
  }
  else{
    req.flash("error", "You are not logged in.");
    res.redirect("/user/login");
  }
}