var models = require("../models/index");
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Auction House' });
});

router.post('/users', function(req, res) {
  models.User.create({
    username: req.body.username
  }).then(function(user) {
    res.json(user);
  });
});

module.exports = router;
