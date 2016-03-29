var models = require("../models/index");
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Auction House' });
});

router.post('/login', function(req, res) {
  	console.log(req.body.username);
  models.User.create({
    username: req.body.username
  }).then(function(user) {

  	// default items
  	var defaultItems = [{
  		name: "Bread",
  		quantity: 30
  	},{
  		name: "Carrot",
  		quantity: 18
  	},{
  		name: "Diamond",
  		quantity: 1
  	}];

  	console.log(user);
  	for (var i = defaultItems.length - 1; i >= 0; i--) {
  		console.log(defaultItems);
	  	models.UserItems.create({
	  		UserId: user.id,
	  		name: defaultItems[i].name,
	  		quantity: defaultItems[i].quantity
	  	});
  	}

    res.json(user);
  });
});

module.exports = router;
