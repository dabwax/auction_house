var express = require('express');
var models = require("../models/index");
var router = express.Router();

router.get('/user_logged', function(req, res, next) {

	var defaultReturn = {
		user: false,
		userItems: false
	};

	// if current user has logged
  	if(req.cookies.userLogged) {

  		// set the data
  		defaultReturn.user = req.cookies.userLogged;


  		// set the user items data
		models.UserItems.findAll({
			where: {
				UserId: req.cookies.userLogged.id
			}
		}).then(function(UserItems) {
  			defaultReturn.userItems = UserItems;

		  	// return as JSON
			res.json(defaultReturn);
  		});
  	} else {
	  	// return as JSON
		res.json(defaultReturn);
  	}

});

router.get('/current_auction', function(req, res, next) {

	var defaultReturn = {
		auction: false
	};

	// return as JSON
	res.json(defaultReturn);

});

module.exports = router;
