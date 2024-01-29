const { Router } = require("express");

const shopRouter = Router();

shopRouter.route("/").get((req, res) => {
  res.render("shops");
});

module.exports = shopRouter;
