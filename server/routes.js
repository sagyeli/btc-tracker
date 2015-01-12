/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

var bitcoinapi = require('bitcoin-node-api');
bitcoinapi.setWalletDetails({ host: 'localhost', port: 8332, user: 'admin', pass: '1234' });
bitcoinapi.setAccess('default-safe');

module.exports = function(app) {

  // Insert routes below
  app.use('/bitcoin/api', bitcoinapi.app);
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
