'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TransactionSchema = new Schema({
  hash: String,
  block: { type: Schema.ObjectId, ref: 'BlockSchema' },
  info: Schema.Types.Mixed
});

module.exports = mongoose.model('Transaction', TransactionSchema);