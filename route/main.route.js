const { Router } = require("express");
const { registerUser } = require("../controller/user.controller");

const mainRouter = Router();

mainRouter.route("/").get((req, res) => {
  res.render("index");
});

// Register route
mainRouter
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post(registerUser);

module.exports = mainRouter;
