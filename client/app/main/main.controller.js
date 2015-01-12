'use strict';

angular.module('btcTrackerApp')
	.controller('MainCtrl', ['$scope', 'routeBuilder', function ($scope, routeBuilder) {
		var bitcoinAddressRegex = /[13][a-km-zA-HJ-NP-Z0-9]{26,33}/g;

		$scope.resultRoute = [];
		$scope.submit = function() {
			if ($scope.query) {
				var extractedAddresses = $scope.query.match(bitcoinAddressRegex);

				routeBuilder({
					addresses: extractedAddresses,
					start: function (info) {
						// TODO - Show progress bar
						console.log(info);
					},
					progress: function (info) {
						// TODO - Update progress bar
						console.log(info);
					},
					done: function (info) {
						// TODO - Hide progress bar & and show results
						$scope.resultRoute = info.route;
					}
				});
			}
		};

		$scope.items = [
			['ideas1', 1],
			['ideas2', 8],
			['ideas3', 5]
		];
	}]);