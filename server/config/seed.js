/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var bitcoin = require('../../node_modules/bitcoin-node-api/node_modules/bitcoin');
var bitcoinClient = new bitcoin.Client({ host: 'localhost', port: 8332, user: 'admin', pass: '1234' });

var Block = require('../api/block/block.model');
var Transaction = require('../api/transaction/transaction.model');
var Address = require('../api/address/address.model');


var transactionsRecordCreator = function(txids, block, numOfTxsLeft, nextBlockCallback) {
  bitcoinClient.cmd([{ method: 'getrawtransaction', params: [txids[txids.length - numOfTxsLeft], 1] }], function(err, response) {
    if (err) {
      console.error(err);
      return;
    }

    var transaction = new Transaction({
      hash: response.txid,
      block: block,
      input: [],
      output: [],
    });

    transaction.save(function (err) {
      if (err) {
        console.error(err);
        return;
      }

      if (numOfTxsLeft > 1) {
        transactionsRecordCreator(txids, block, numOfTxsLeft - 1, nextBlockCallback);
      }
      else if (nextBlockCallback) {
        nextBlockCallback();
      }
    });
  });
}

var blockRecordCreator = function(firstBlockIndex, lastBlockIndex) {
  bitcoinClient.cmd([{ method: 'getblockhash', params: [firstBlockIndex] }], function(err, response) {
    if (err) {
      console.error(err);
      return;
    }

    var block = new Block({
      hash: response,
      info: { }
    });

    bitcoinClient.cmd([{ method: 'getblock', params: [response] }], function(err, response) {
      if (err) return handleError(err);

      block.save(function (err) {
        if (err) {
          console.error(err);
          return;
        }

        if (firstBlockIndex === 0) {
          Transaction.create({
            hash: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
            block: block,
            input: [],
            output: [{
              address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
              amount: 50
            }]
          });

          blockRecordCreator(1, lastBlockIndex);
        }
        else if (response.tx.length > 0) {
          transactionsRecordCreator(response.tx, block, response.tx.length, function () {
            if (firstBlockIndex < lastBlockIndex) {
              blockRecordCreator(firstBlockIndex + 1, lastBlockIndex);
            }
          });
        }
      });
    });
  });
}

Block.count(function (err, count) {
  if (err) {
    console.error(err);
    return;
  }

  bitcoinClient.cmd([{ method: 'getblockcount', params: [] }], function(err, response) {
    if (err) {
      console.error(err);
      return;
    }

    blockRecordCreator(count, parseInt(response));
  });
});