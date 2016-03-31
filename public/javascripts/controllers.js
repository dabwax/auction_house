var DashboardCtrl = function($scope, User, Auction, socket, $location) {

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

	// Function to handle auction refresh's
	$scope.refreshAuction = function() {
		Auction.currentAuction.then(function(resp) {

			if(resp.data.auction) {
				$scope.currentAuction = resp.data;
				$("#timeleft").countdown({until: resp.data.expectedDate});

			} else {
				$scope.currentAuction = false;
			}
		});
	}
	// First refresh auction
	$scope.refreshAuction();

	// Function when start auction button is pressed
	$scope.startAuction = function(key) {
		// set selected item
		$scope.currentItem = $scope.userLogged.userItems[key];

		// clear old data
		$scope.newAuction = null;

		// show modal
		$('#modalAuction').modal('show');

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
