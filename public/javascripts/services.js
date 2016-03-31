var User = function($http) {

	return {
		userLogged: $http.get("/api/user_logged")
	};
};

var Auction = function($http) {

	return {
		currentAuction: $http.get("/api/auction/current"),
		create: function(newAuction) {

			return $http.post("/api/auction/create", newAuction);
		}
		,
	};
};

angular.module("AuctionHouse").factory("User", User);
angular.module("AuctionHouse").factory("Auction", Auction);
