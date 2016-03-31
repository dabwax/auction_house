var timeleft = function($interval, $timeout, $http) {

  return {
    restrict: "AE",
    scope: {
      currentAuction: '='
    },
    link: function(scope, element, attrs) {


      var expectedDate = new Date(scope.$parent.currentAuction.expectedDate);

      $(element).countdown({
        until: expectedDate,
        onExpiry: function() {

          $timeout(function() {
            // check if current user is the winner
            $http.post('/api/auction/winner', {
              currentAuction: scope.$parent.currentAuction.auction,
              currentUser: scope.$parent.userLogged
            }).then(function(result) {

              if(result.data.item_returned == true) {

                $timeout(function() {
                  // clear current auction
                  scope.$parent.messages.push({
                    status: "danger",
                    display: "Nobody bidded your auction. Your item returned to your inventory. Try again and good luck! :3"
                  });
                  scope.$apply();
                });

              }

              $timeout(function() {
                // clear current auction
                scope.$parent.currentAuction.auction.User.username = false;
                scope.$apply();
              });

            });
          });
          
        }
      });

    }
  }
};

angular.module("AuctionHouse").directive("timeleft", timeleft);
