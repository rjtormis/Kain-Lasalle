const { Router } = require("express");

const mainRouter = Router();

mainRouter.route("/").get((req, res) => {
  res.render("profile");
});

module.exports = mainRouter;
