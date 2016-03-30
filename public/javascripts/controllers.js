var DashboardCtrl = function($scope, User, Auction) {

	$scope.messages = [];

	User.userLogged.then(function(resp) {
		$scope.userLogged = resp.data;
	});

	function refreshAuction(teste) {
		Auction.currentAuction.then(function(resp) {


			if(resp.data.auction) {
				$scope.currentAuction = resp.data;
			} else {
				$scope.currentAuction = false;
			}
			if(teste) {
				$scope.currentAuction = true;
				$scope.messages.push({status: "danger", display: "is not saving yet. :("});
			}
		});
	}

	refreshAuction();

	$scope.startAuction = function(key) {
		$scope.currentItem = $scope.userLogged.userItems[key];

		$('#modalAuction').modal('show');

	};

	$scope.submitAuction = function() {
		$scope.messages.push({
			status: "success",
			display: "Your auction was started with success!"
		});

		$('#modalAuction').modal('hide');
		refreshAuction("abacate");
	};
};

angular.module("AuctionHouse").controller("DashboardCtrl", DashboardCtrl);
