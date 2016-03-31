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

	var startDate = new Date();
	startDate.setSeconds(startDate.getSeconds()-10);

	var endDate = new Date();

	models.Auction.findOne({
		include: [models.User, models.UserItems],
		order: [['createdAt', 'DESC']],
		where: {
			createdAt: {
				$gte: startDate,
				$lte: endDate
			}
		}
	}).then(function(auction) {

		if(auction) {
			defaultReturn.auction = auction;

			// calculate remaining time
			var expectedDate = auction.createdAt;
			expectedDate.setSeconds(expectedDate.getSeconds()+10);

			defaultReturn.expectedDate = expectedDate;

			// include current bidder user info
			var expectedId = auction.UserId;

			if(auction.current_bid_author > 0) {
				expectedId = auction.current_bid_author;
			}

			models.User.findOne({
				where: {
					id: expectedId
				}
			}).then(function(result) {
				defaultReturn.user = result;

				// return as JSON
				res.json(defaultReturn);
			});
		} else {

			// return as JSON
			res.json(defaultReturn);
		}

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

    var io = req.app.get('io');

    io.emit('auction:created');

    // update user item quantity

		models.UserItems.findOne({
			where: {
				id: req.body.currentItem.id
			}
		}).then(function(UserItem) {
			UserItem.update({
				quantity: UserItem.quantity - req.body.auction.quantity
			});

    		var io = req.app.get('io');
			io.emit('user:updated');
  		});

	// return as JSON
	res.json(defaultReturn);

});

router.post('/auction/winner', function(req, res, next) {

	var defaultReturn = {
		item_returned: false
	};

	var auction = req.body.currentAuction;
	var user = req.body.currentUser;

    var io = req.app.get('io');


	// get auction again
	models.Auction.findOne({
		where: {
			id: auction.id
		}
	}).then(function(auction) {

		// if auction not checked yet
		if(auction.already_checked == 0) {
			// set him as checked
			auction.update({
				already_checked: 1
			});

			// if has no bidders
			if(auction.current_bid_author == 0) {
				// return item for inventory of user
				models.UserItems.findOne({
					where: {
						id: auction.UserItemId
					}
				}).then(function(UserItem) {

					models.UserItems.update({
						quantity: UserItem.quantity + auction.quantity
					}, {
						where: {
							id: auction.UserItemId
						}
					});

					// updates inventory
	    			io.emit('user:updated');
				});

    			// alert user the item is returned
    			defaultReturn.item_returned = true;
			// if has bidders
			} else {
				// add new item in winner inventory
				models.UserItems.findOne({
					where: {
						id: auction.UserItemId
					}
				}).then(function(UserItem) {

					// search same item but from winner
					models.UserItems.findOne({
						where: {
							name: UserItem.name,
							UserId: auction.current_bid_author
						}
					}).then(function(result) {
						result.update({
							quantity: result.quantity + auction.quantity
						});

						io.emit('user:alert:success', {id: auction.current_bid_author, name: result.name, type: "you_won"});
						io.emit('user:alert:success', {id: auction.UserId, name: result.name, type: "you_sell"});
					});

					// updates inventory
	    			io.emit('user:updated');
				});
			}

			// return as JSON
			res.json(defaultReturn);

		} else {

			// return as JSON
			res.json(defaultReturn);
		}



	});

});

router.post('/auction/bid', function(req, res, next) {
	var bid = req.body.bid;

	var defaultReturn = {};

	models.Auction.findOne({
		where: {
			id: bid.auction.id
		}
	}).then(function(auction) {
		

		// update auction with the current bid
		auction.update({
			current_bid: bid.value,
			current_bid_author: bid.author.user.id
		});

		// return as JSON
		res.json(defaultReturn);
	});
});
module.exports = router;
