const mongoose = require("mongoose");

async function dbConnection(DB_URL) {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to Insurance Policy DB!");
  } catch (e) {
    console.error("Error while connecting to DB.");
  }
}

module.exports = {
  dbConnection,
};