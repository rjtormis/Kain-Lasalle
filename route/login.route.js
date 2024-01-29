const { Router } = require("express");

const mainRouter = Router();

mainRouter.route("/").get((req, res) => {
  res.render("login");
});

module.exports = mainRouter;
