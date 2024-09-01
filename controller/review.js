const List = require("../models/list.js");
const Review = require("../models/review.js");

module.exports.addReview = async(req, res)=>{
  let {id} = req.params;
  let listItem = await List.findById(id);
  let data = req.body;
  let newReview = new Review(data);
  newReview.author = req.user._id;
  await newReview.save();
  listItem.reviews.push(newReview);
  await listItem.save();
  req.flash("success", "Review added successfully!");
  res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async(req, res)=>{
  let { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await List.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${id}`);
}