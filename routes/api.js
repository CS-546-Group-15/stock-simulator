const express = require("express");
const router = express.Router();
const data = require('../data');
const userData = data.users;

router.get("/", (req, res) => {
  res.render("display/login");
});

module.exports = router;
