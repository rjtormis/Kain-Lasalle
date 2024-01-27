import { connectToDatabases, closeDatabaseConnections } from "./utilities/general";
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const MongoClient = require("mongodb").MongoClient;
const CryptoJS = require("crypto-js");
const ObjectId = require("mongodb").ObjectId;

export const app = express();
const port = 3000;

let databases = {};

app.use(bodyParser.json());
app.use(express.static("views"));

app.post("/login", async (req, res) => {
  try {
    await connectToDatabases();
    e;

    const { username, password } = req.body;

    const registrationCollection = databases.registration.collection;
    const user = await registrationCollection.findOne({ schoolEmail: username });

    if (!user) {
      res.status(401).json({ success: false, message: "No existing user found!" });
      return;
    }

    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

    if (hashedPassword === user.password) {
      // Set a cookie with the user's email
      res.cookie("loggedInUserEmail", user.schoolEmail, { maxAge: 900000, httpOnly: true }); // Adjust maxAge as needed
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Incorrect password" });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Internal Server Error");
  } finally {
    await closeDatabaseConnections();
  }
});

app.post("/register", async (req, res) => {
  try {
    await connectToDatabases();

    const { registrationType, schoolEmail, fullName, username, password } = req.body;

    const registrationCollection = databases.registration.collection;

    const existingUser = await registrationCollection.findOne({ username });

    if (existingUser) {
      res.status(200).json({
        success: false,
        message: "Username already exists. Please choose a different one.",
      });
      return;
    }

    const result = await registrationCollection.insertOne({
      registrationType,
      schoolEmail,
      fullName,
      username,
      password,
    });
    res.status(200).json({
      success: true,
      message: "Registration successful! Redirecting to login",
      userId: result.insertedId,
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  } finally {
    await closeDatabaseConnections();
  }
});

app.post("/adlogin", async (req, res) => {
  try {
    await connectToDatabases();

    const { username, password } = req.body;

    const aduserCollection = databases.aduser.collection;
    const userAduser = await aduserCollection.findOne({ username });

    if (!userAduser) {
      res.status(401).json({ success: false, message: "No existing admin found!" });
      return;
    }

    if (password === userAduser.password) {
      // Add a message indicating successful login
      res.status(200).json({ success: true, message: "Logging in..." });
    } else {
      res.status(401).json({ success: false, message: "Incorrect password for admin" });
    }
  } catch (err) {
    console.error("Error during admin login:", err);
    res.status(500).send("Internal Server Error");
  } finally {
    await closeDatabaseConnections();
  }
});

// ... (other routes)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
