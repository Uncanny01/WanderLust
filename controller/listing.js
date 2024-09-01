const axios = require("axios");
const List = require("../models/list.js");
const Review = require("../models/review.js");


module.exports.Index = async(req, res)=>{
  const listings = await List.find();
  res.render("listings", {listings});
}

module.exports.addRoute = (req, res)=>{
  res.render("add");
}


module.exports.showListRoute = async(req, res)=>{
  let {id} = req.params;
  let result = await List.findById(id).populate({path: "reviews", populate: {path: "author",},}).populate("owner");
  if(!result){
    req.flash("error", "Data you are trying to access is either deleted or does not exist.");
    res.redirect("/listings");
  }
  else
  res.render("show", {result, mapKey: process.env.MAP_KEY});
}

module.exports.editListRoute = async(req, res)=>{
  let {id} = req.params;
  let result = await List.findById(id);
  if(!result){
    req.flash("error", "Data you are trying to edit is either deleted or does not exist.");
    res.redirect("/listings");
  }
  else
  res.render("edit", {result});
}

let coords;
module.exports.addList = async(req, res)=>{
  let url = req.file.path;
  let filename = req.file.filename;
  let {title, description, price, country, location} = req.body;
  coords = { lat : 0, long : 0};
  try{
    const result = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: encodeURIComponent(location),
        key: process.env.MAP_KEY
      }
    });
    if(result.data.status==='OK')
    {
      const geometry = result.data.results[0].geometry.location;
      coords = { lat: geometry.lat, long: geometry.lng }; 
    }else{
      req.flash("error", `${result.data.status}: Something went wrong with Geo api.`);
    }
  }
  catch(err)
  {
    req.flash("error", `${err}`)
  }
  let newListItem = List({title, description, image: {url, filename}, price, country, location, geometry: coords, owner: req.user._id});
  await newListItem.save();
  req.flash("success", "Item added successfully!");
  res.redirect("/listings");
}

module.exports.updateList = async(req, res)=>{
  let {id} = req.params;
  let {title, description, price, country, location} = req.body;
  
  let listing = await List.findByIdAndUpdate(id, {title, description, price, country, location});

  if(typeof req.file !== "undefined")
  {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
  }

  req.flash("success", "Item updated successfully!");
  res.redirect(`/listings/${id}`);
}

module.exports.destroyList = async(req, res)=>{
  let {id} = req.params;
  let item = await List.findById(id).populate("reviews");
  for(let review of item.reviews)
  {
    await Review.findByIdAndDelete(review);
  }
  await List.findByIdAndDelete(id);
  req.flash("success", "Item deleted successfully!");
  res.redirect("/listings");
}