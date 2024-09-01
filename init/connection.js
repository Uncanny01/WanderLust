const mongoose = require("mongoose");

const mongoDbUrl = process.env.MONGO_URI;
async function main()
{
  await mongoose.connect(mongoDbUrl);
}

main()
.then(()=>console.log("Connection Success"))
.catch((err)=>console.log("Error connecting to Database."))

module.exports = main;