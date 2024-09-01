const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { reviewSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");
const reviewController = require("../controller/review.js");

// server-side validation for reviews
const validateReviews = (req, res, next)=>{
  const {error} = reviewSchema.validate(req.body);
  if(error)
  {
    throw new expressError(400, error.details[0].message); 
  }
  else
  next();
}

// adding reviews
router.post("/", isLoggedIn, validateReviews, wrapAsync(reviewController.addReview));

//delete reviews
router.delete("/:reviewId", wrapAsync(reviewController.deleteReview));

module.exports = router;

