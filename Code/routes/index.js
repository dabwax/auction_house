var models = require("../models/index");
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Auction House' });
});

router.post('/login', function(req, res) {

  // Find or Create (if new user, create. if old user, login.)

  // new user begins with 100 points on balance field
  models.User.findOrCreate({
    where: {
      username: req.body.username
    }
  }).spread(function(user, created) {

    // if the user was created, insert the default items on your inventary
    if(created) {
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

    	for (var i = defaultItems.length - 1; i >= 0; i--) {
  	  	models.UserItems.create({
  	  		UserId: user.id,
  	  		name: defaultItems[i].name,
  	  		quantity: defaultItems[i].quantity
  	  	});
      }
  	} // end - create

    // create the session
    req.session.userLogged = user;
    
    console.log(req.session);

    res.redirect('/dashboard');
  });
});

module.exports = router;
