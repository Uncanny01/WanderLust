require('dotenv').config();

const express = require("express");
const app = express();
const port = 8080;
const methodOverride = require("method-override");
const path = require("path");
require("./init/connection.js");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));

const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24*3600,
});

store.on("error", ()=>{
  console.log(`Error in mongo session store: ${e}`);
  
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 24 * 60 * 60 * 1000,
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  next();
})

// app.use("/", listingRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/user", userRouter);

// page not found route
app.all("*", (req, res, next)=>{
  next(new expressError(404, "Page not found"));
})

// next() route
app.use((err, req, res, next)=>{
  let {status=500, message="There was an error"} = err;
  // res.status(status).send(message);¸
  res.status(status).render("error.ejs", {message});
})

// listening to port
app.listen(port, ()=>{
  console.log(`Listening to port: ${port}`);
})