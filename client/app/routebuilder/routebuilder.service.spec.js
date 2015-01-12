'use strict';

describe('Service: routebuilder', function () {

  // load the service's module
  beforeEach(module('btcTrackerApp'));

  // instantiate service
  var routebuilder;
  beforeEach(inject(function (_routebuilder_) {
    routebuilder = _routebuilder_;
  }));

  it('should do something', function () {
    expect(!!routebuilder).toBe(true);
  });

});
