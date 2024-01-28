require("dotenv").config();

// Follow proper export, naka commonJS yung project setup.
const mongoose = require("mongoose");
const DB = process.env.DATABASE;
const PORT = parseInt(process.env.PORT) || 3000;

async function ConnectMongoDB() {
  try {
    await mongoose.connect(DB);
  } catch (e) {
    console.log("Failed to set up database connection:", e);
  }
}

module.exports = { PORT, ConnectMongoDB };
