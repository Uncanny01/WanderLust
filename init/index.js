const mongoose = require("mongoose");
require("./connection");
const list = require("../models/list");
const data = require("./data");

const initDb = async ()=>{
  await list.deleteMany({});
  data.data = data.data.map((obj)=>({...obj, owner: '6666f71ba8ae403a7be4769f'}));
  await list.insertMany(data.data);
  console.log("Database initialized");
}

initDb();