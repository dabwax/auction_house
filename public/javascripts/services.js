var User = function($http) {

	return {
		userLogged: $http.get("/api/user_logged")
	};
};

var Auction = function($http) {

	return {
		currentAuction: $http.get("/api/current_auction")
	};
};

angular.module("AuctionHouse").factory("User", User);
angular.module("AuctionHouse").factory("Auction", Auction);
