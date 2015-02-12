/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var bitcoin = require('../../node_modules/bitcoin-node-api/node_modules/bitcoin');
var bitcoinClient = new bitcoin.Client({ host: 'localhost', port: 8332, user: 'admin', pass: '1234' });

var Block = require('../api/block/block.model');


Block.count(function (err, count) {
  if (err) {
    console.error(err);
    return;
  }

  var blockRecordCreator = function(firstIndex, lastIndex) {
    bitcoinClient.cmd([{ method: 'getblockhash', params: [firstIndex] }], function(err, response) {
      if (err) {
        'Error! ' + console.log(err);
        return;
      }

      Block.create({
        hash : response,
        info : { test: 'Bla bla bla' }
      });

      if (firstIndex < lastIndex) {
        blockRecordCreator(firstIndex + 1, lastIndex);
      }
    });
  }

  bitcoinClient.cmd([{ method: 'getblockcount', params: [] }], function(err, response) {
    if (err) {
      console.error(err);
      return;
    }

    blockRecordCreator(count, parseInt(response));
  });
});