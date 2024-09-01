const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


// server-side validation for listings
const validation = (req, res, next)=>{
  const {error} = listSchema.validate(req.body);
  if(error)
  {
    throw new expressError(400, error.details[0].message); 
  }
  else
  next();
}

// show listings route
router.get("/", wrapAsync(listingController.Index));

// add listings route
router.get("/add", isLoggedIn, listingController.addRoute);

// show particular listing route
router.get("/:id", wrapAsync(listingController.showListRoute));

// edit listing route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.editListRoute));

// new list item added
router.post("/", isLoggedIn, upload.single('imageUrl'), validation, wrapAsync(listingController.addList));

// update listing
router.post("/:id", isLoggedIn, upload.single('imageUrl'), validation, listingController.updateList);

// delete operation
router.delete("/:id", isLoggedIn, wrapAsync(listingController.destroyList));

module.exports = router;