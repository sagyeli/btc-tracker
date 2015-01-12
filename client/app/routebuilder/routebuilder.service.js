'use strict';

angular.module('btcTrackerApp')
	.service('routeBuilder', ['$http', function ($http) {

		var addresses,
		scannedAddresses = [],
		start,
		progress,
		done,
		calculateRoutes = function (startAddress, endAddresses, func) {
			var addressesQueue = [];
			var candidateAddress = [];

			scannedAddresses.push(startAddress);
			addressesQueue.push([startAddress]);
			var execute = function() {
				if ((candidateAddress = addressesQueue.splice(0,1)[0]) != null) {
					if (endAddresses.indexOf(candidateAddress[candidateAddress.length - 1]) >= 0) {
						func(candidateAddress);
					}
					else {
						getConnectedAddresses(candidateAddress[candidateAddress.length - 1], function (addresses) {
							for (var i = 0 ; i < addresses.length ; i++) {
								var address = addresses[i],
									route = candidateAddress.concat([address]);

								addressesQueue.push(route);
							}

							execute();
						});
					}
				}
				else {
					scannedAddresses = [];
					func(null);
				}
			}
			execute();
		},
		getConnectedAddresses = function (address, func) {
			$http.get('https://blockchain.info/multiaddr?active=' + address + '&cors=true').
  				success(function(data, status, headers, config) {
  					var addresses = [],
  						txs = data.txs,
  						i = txs.length;

  					while (i--) {
  						var inAddress = data.txs[i].inputs[0].prev_out.addr,
  							outAddress = data.txs[0].out[0].addr;

  						if (scannedAddresses.indexOf(inAddress) < 0) {
  							scannedAddresses.push(inAddress);
  							addresses.unshift(inAddress);
  						}
  						if (scannedAddresses.indexOf(outAddress) < 0) {
  							scannedAddresses.push(outAddress);
  							addresses.unshift(outAddress);
  						}
  					}

  					func(addresses);
  				});
		};

		return function (options) {
			options = options || {};
			addresses = options.addresses || [];
			start = options.start || new Function;
			progress = options.progress || new Function,
			done = options.done || new Function;

			// TODO - Use attributes & functions
			calculateRoutes(addresses[0], addresses.slice(1), function (addresses) {
				done({
					route: addresses
				});
			});
		}
	}]);