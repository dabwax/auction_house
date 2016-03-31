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

var socket = function($rootScope) {
  var socket = io.connect(window.location.host);
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
};

angular.module("AuctionHouse").factory("User", User);
angular.module("AuctionHouse").factory("Auction", Auction);
angular.module("AuctionHouse").factory("socket", socket);
