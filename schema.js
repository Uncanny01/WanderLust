const Joi = require("joi");

module.exports.listSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  imageUrl: Joi.string().allow("", null),
  price: Joi.number().required().min(0),
  country: Joi.string().required(),
  location: Joi.string().required()
})

module.exports.reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().required()
})