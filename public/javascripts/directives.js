var timeleft = function($timeout) {

	return {
		restrict: "A",
		link: function(scope, elem, attrs) {
			var expectedDate = new Date(scope.currentAuction.expectedDate);

			$(elem).countdown({
				until: expectedDate,
				onExpiry: function() {
					window.location.reload();
				}
			});
		}
	}
};

angular.module("AuctionHouse").directive("timeleft", timeleft);
