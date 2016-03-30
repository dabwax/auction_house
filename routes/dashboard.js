var express = require('express');
var models = require("../models/index");
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('dashboard', { title: "Dashboard - Auction House" });
});

module.exports = router;
