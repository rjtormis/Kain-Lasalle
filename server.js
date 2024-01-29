const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const ejsMate = require("ejs-mate");
const MongoClient = require("mongodb").MongoClient;
const CryptoJS = require("crypto-js");
const ObjectId = require("mongodb").ObjectId;
const { ConnectMongoDB, PORT } = require("./utilities/general");

// Routes
const mainRoute = require("./route/main.route");
const shopRoute = require("./route/shop.route");
const aboutRoute = require("./route/about.route");
const adminRoute = require("./route/admin.route");
const adloginRoute = require("./route/adlogin.route");
const cartRoute = require("./route/cart.route");
const contactRoute = require("./route/contact.route");
const loginRoute = require("./route/login.route");
const homepageRoute = require("./route/homepage.route");
const profileRoute = require("./route/profile.route");
const vendorRoute = require("./route/vendor.route");

// Schema
const User = require("./schema/userSchema");

const app = express();

// Function that enables the database.
ConnectMongoDB();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));

// Index or main page
app.use("/", mainRoute);
app.use("/shops", shopRoute);
app.use("/", adminRoute);
app.use("/", aboutRoute);
app.use("/", adloginRoute);
app.use("/", cartRoute);
app.use("/", contactRoute);
app.use("/", loginRoute);
app.use("/", homepageRoute);
app.use("/", profileRoute);
app.use("/", vendorRoute);


app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ userName: username });

    if (!user) {
      res.status(401).json({ success: false, message: "No existing user found!" });
      return;
    }

    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

    if (hashedPassword === user.password) {
      // Set a cookie with the user's email
      // res.cookie("loggedInUserEmail", user.schoolEmail, { maxAge: 900000, httpOnly: true }); // Adjust maxAge as needed
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Incorrect password" });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/adlogin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const userAduser = await User.findOne({ username });

    if (!userAduser) {
      res.status(401).json({ success: false, message: "No existing admin found!" });
      return;
    }

    if (password === User.password) {
      // Add a message indicating successful login
      res.status(200).json({ success: true, message: "Logging in..." });
    } else {
      res.status(401).json({ success: false, message: "Incorrect password for admin" });
    }
  } catch (err) {
    console.error("Error during admin login:", err);
    res.status(500).send("Internal Server Error");
  }
});

// ... (other routes)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
