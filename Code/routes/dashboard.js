var express = require('express');
var models = require("../models/index");
var router = express.Router();

router.get('/', function(req, res, next) {

  // append current UserItems
  models.UserItems.findAll({
    where: {
      UserId: req.cookies.userLogged.id
    }
  }).then(function(UserItems) {
    req.cookies.userLogged.userItems = UserItems;

    res.render('dashboard', { title: "Dashboard - Auction House", userLogged: req.cookies.userLogged });
  });


});

module.exports = router;
