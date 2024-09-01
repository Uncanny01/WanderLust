const { number } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const listingSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 100
  },
  description: {
    type: String,
    required: true,
    alias: "desc",
    maxLength: 500
  },
  image: {
    filename: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      set: (v) => v === "" ? "https://plus.unsplash.com/premium_vector-1714618860091-a4324d7b355a?bg=FFFFFF&w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGFnZSUyMG5vdCUyMGZvdW5kfGVufDB8fDB8fHww" : v,
      default: "https://plus.unsplash.com/premium_vector-1714618860091-a4324d7b355a?bg=FFFFFF&w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGFnZSUyMG5vdCUyMGZvdW5kfGVufDB8fDB8fHww"
    }
  },
  price: {
    type: Number,
    min: 1,
  },
  location: {
    type: String
  },
  country: {
    type: String
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  geometry:{
    lat:{
      type: Number,
    },
    long:{
      type: Number
    }
  }
})

const List = mongoose.model("List", listingSchema);

module.exports = List;