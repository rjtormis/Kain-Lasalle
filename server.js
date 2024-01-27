// import { connectToDatabases, closeDatabaseConnections } from "./utilities/general.js";
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const MongoClient = require("mongodb").MongoClient;
const CryptoJS = require("crypto-js");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = 3000;

let databases = {};

async function connectToDatabases() {
  try {
    for (const collectionKey in dbConfig) {
      const collectionConfig = dbConfig[collectionKey];
      const client = await MongoClient.connect(collectionConfig.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const database = client.db(collectionConfig.dbName);
      const collection = database.collection(collectionConfig.collectionName);

      databases[collectionKey] = {
        client: client,
        database: database,
        collection: collection,
      };

      console.log(`Connected to MongoDB for collection: ${collectionKey}`);
    }
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
}

async function closeDatabaseConnections() {
  try {
    for (const collectionKey in databases) {
      const db = databases[collectionKey];
      await db.client.close();
      console.log(`Closed connection to MongoDB for collection: ${collectionKey}`);
    }
  } catch (err) {
    console.error("Error closing MongoDB connections:", err);
    throw err;
  }
}

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
