var DashboardCtrl = function($scope, User, Auction, socket, $timeout, $http) {

	// Alerts system
	$scope.messages = [];

	// Get user logged info
	User.userLogged.then(function(resp) {
		$scope.userLogged = resp.data;
	});

	// when user login in another device, force logout to current users
	socket.on('user:logged', function(data) {

		if(data.id == $scope.userLogged.user.id) {
			window.location = '/logout';
		}
	});

	socket.on('auction:created', function() {
		$scope.refreshAuction();
	});

	socket.on('user:alert:success', function(data) {

		if($scope.userLogged.user.id == data.id) {

			if(data.type == "you_won") {
				$scope.messages.push({
					status: "success",
					display: "You won the auction! " + data.name + " belongs to you now."
				});
			}

			if(data.type == "you_sell") {
				$scope.messages.push({
					status: "success",
					display: "Your auction was selled with success! Somebody have your " + data.name + " now."
				});
			}
		}
	});

	socket.on('user:updated', function() {
		// Get user logged info
		$http.get("/api/user_logged").then(function(resp) {
			$scope.userLogged = resp.data;
		});
	});

	// Function to handle place bid
	$scope.placeBid = function(bid) {
		bid.author = $scope.userLogged;
		bid.auction = $scope.currentAuction.auction;

		$http.post("/api/auction/bid", {bid: bid}).then(function(result) {
			$scope.refreshAuction();
		});
	}

	// Function to handle auction refresh's
	$scope.refreshAuction = function() {

		$http.get("/api/auction/current").then(function(resp) {
			if(resp.data.auction) {
				$scope.currentAuction = resp.data;
			} else {
				$scope.currentAuction = false;
			}
		});

	}

	$scope.calculateMin = function(minimum, current) {
		var defaultReturn = minimum;

		if(current >= minimum) {
			defaultReturn = current;
		}

		return defaultReturn;
	}

	// First refresh auction
	$scope.refreshAuction();

	// Function when start auction button is pressed
	$scope.startAuction = function(key) {

		$http.get("/api/auction/current").then(function(resp) {
			if(resp.data.auction) {
				$scope.messages.push({
					status: "danger",
					display: "Actually has a auction happening. Wait for this to start a new."
				});
			} else {
				// set selected item
				$scope.currentItem = $scope.userLogged.userItems[key];

				// clear old data
				$scope.newAuction = null;

				// show modal
				$('#modalAuction').modal('show');
			}
		});

	};

	// Function when form new auction is submitted
	$scope.submitAuction = function() {

		// Create new auction
		Auction.create({
			auction: $scope.newAuction,
			user: $scope.userLogged,
			currentItem: $scope.currentItem}).then(function(result) {

			// Alert
			$scope.messages.push({
				status: "success",
				display: "Your auction was started with success!"
			});

			// Hide modal
			$('#modalAuction').modal('hide');
		});

	};
};

angular.module("AuctionHouse").controller("DashboardCtrl", DashboardCtrl);
