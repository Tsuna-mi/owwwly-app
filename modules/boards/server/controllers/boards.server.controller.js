'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Board = mongoose.model('Board'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Board
 */
exports.create = function(req, res) {
  var board = new Board(req.body);
  board.user = req.user;

  board.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(board);
    }
  });
};

/**
 * Show the current Board
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var board = req.board ? req.board.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  board.isCurrentUserOwner = req.user && board.user && board.user._id.toString() === req.user._id.toString();

  res.jsonp(board);
};

/**
 * Update a Board
 */
exports.update = function(req, res) {
  var board = req.board;

  board = _.extend(board, req.body);

  board.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(board);
    }
  });
};

/**
 * Delete an Board
 */
exports.delete = function(req, res) {
  var board = req.board;

  board.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(board);
    }
  });
};

/**
 * List of Boards
 */
exports.list = function(req, res) {
  Board.find().sort('-created').populate('user', 'displayName').exec(function(err, boards) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(boards);
    }
  });
};

/**
 * Board middleware
 */
exports.boardByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Board is invalid'
    });
  }

  Board.findById(id).populate('user', 'displayName').exec(function (err, board) {
    if (err) {
      return next(err);
    } else if (!board) {
      return res.status(404).send({
        message: 'No Board with that identifier has been found'
      });
    }
    req.board = board;
    next();
  });
};
