'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TransactionSchema = new Schema({
  hash: String,
  block: { type: Schema.ObjectId, ref: 'BlockSchema' },
  input: [{
  	// address: { type: Schema.ObjectId, ref: 'AddressSchema' },
  	address: String,
  	amount: Number
  }],
  output: [{
  	// address: { type: Schema.ObjectId, ref: 'AddressSchema' },
  	address: String,
  	amount: Number
  }]
});

module.exports = mongoose.model('Transaction', TransactionSchema);