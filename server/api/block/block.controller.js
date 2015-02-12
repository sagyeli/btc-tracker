'use strict';

var _ = require('lodash');
var Block = require('./block.model');

// Get list of blocks
exports.index = function(req, res) {
  Block.find(function (err, blocks) {
    if(err) { return handleError(res, err); }
    return res.json(200, blocks);
  });
};

// Get a single block
exports.show = function(req, res) {
  Block.findById(req.params.id, function (err, block) {
    if(err) { return handleError(res, err); }
    if(!block) { return res.send(404); }
    return res.json(block);
  });
};

// Creates a new block in the DB.
exports.create = function(req, res) {
  Block.create(req.body, function(err, block) {
    if(err) { return handleError(res, err); }
    return res.json(201, block);
  });
};

// Updates an existing block in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Block.findById(req.params.id, function (err, block) {
    if (err) { return handleError(res, err); }
    if(!block) { return res.send(404); }
    var updated = _.merge(block, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, block);
    });
  });
};

// Deletes a block from the DB.
exports.destroy = function(req, res) {
  Block.findById(req.params.id, function (err, block) {
    if(err) { return handleError(res, err); }
    if(!block) { return res.send(404); }
    block.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}