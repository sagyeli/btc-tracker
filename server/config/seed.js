/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var bitcoin = require('../../node_modules/bitcoin-node-api/node_modules/bitcoin');
var bitcoinClient = new bitcoin.Client({ host: 'localhost', port: 8332, user: 'admin', pass: '1234' });

var Block = require('../api/block/block.model');
var Transaction = require('../api/transaction/transaction.model');


Block.count(function (err, count) {
  if (err) {
    console.error(err);
    return;
  }

  var blockRecordCreator = function(firstBlockIndex, lastBlockIndex) {
    bitcoinClient.cmd([{ method: 'getblockhash', params: [firstBlockIndex] }], function(err, response) {
      if (err) {
        console.error(err);
        return;
      }

      var block = new Block({
        hash : response,
        info : { }
      });

      bitcoinClient.cmd([{ method: 'getblock', params: [response] }], function(err, response) {
        if (err) return handleError(err);

        block.save(function (err) {
          if (err) {
            console.error(err);
            return;
          }
          
          for (var i = 0 ; response.tx && i < response.tx.length ; i++) {
            Transaction.create({
              hash : response.tx[i],
              block: block,
              info : { }
            });          
          }
        });

        if (firstBlockIndex < lastBlockIndex) {
          blockRecordCreator(firstBlockIndex + 1, lastBlockIndex);
        }
      });
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