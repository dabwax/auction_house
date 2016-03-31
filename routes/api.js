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

router.get('/auction/current', function(req, res, next) {

	var defaultReturn = {
		auction: false
	};

	var gLimitDate = new Date();
	gLimitDate.setMinutes(gLimitDate.getMinutes()-10);

	var lLimitDate = new Date();

	console.log(new Date());
	models.Auction.findOne({
		include: [models.User],
		order: [['createdAt', 'DESC']],
		where: {
			createdAt: {
				$gte: gLimitDate,
				$lte: lLimitDate
			}
		}
	}).then(function(auction) {

		if(auction) {
			defaultReturn.auction = auction;

			// calculate remaining time
			var expectedDate = auction.createdAt;
			expectedDate.setMinutes(expectedDate.getMinutes()+1);

			defaultReturn.expectedDate = expectedDate;
			defaultReturn.currentDate = new Date();

		}

		// return as JSON
		res.json(defaultReturn);
	});

});

router.post('/auction/create', function(req, res, next) {

	var defaultReturn = {
		auction: false
	};

	models.Auction.create({
		quantity: req.body.auction.quantity,
		current_bid: 0,
		minimum_bid: req.body.auction.minimum_bid,
		UserId: req.body.user.user.id,
		UserItemId: req.body.currentItem.id,
	});

	// return as JSON
	res.json(defaultReturn);

});

module.exports = router;
