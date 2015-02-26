'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BlockSchema = new Schema({
  hash: String,
  info: Schema.Types.Mixed
});

module.exports = mongoose.model('Block', BlockSchema);