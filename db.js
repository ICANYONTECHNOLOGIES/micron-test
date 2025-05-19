const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL); // no need for extra options
    console.log("Connected to database successfully");
  } catch (error) {
    console.error("Could not connect database!");
    console.error(error);
  }
};
