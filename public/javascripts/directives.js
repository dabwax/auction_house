var timeleft = function($timeout) {

	return {
		restrict: "A",
		link: function(scope, elem, attrs) {
			var expectedDate = new Date(scope.currentAuction.expectedDate);
			var currentDate = new Date();

			if(expectedDate.getTime() >= currentDate.getTime()) {
				$(elem).countdown({
					until: expectedDate,
					onExpiry: function() {
						window.location.reload();
					}
				});
			} else {
				$timeout(function() {
					//scope.currentAuction = false;
				});
			}
		}
	}
};

angular.module("AuctionHouse").directive("timeleft", timeleft);
