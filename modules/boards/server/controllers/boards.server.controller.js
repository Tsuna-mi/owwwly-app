'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Board = mongoose.model('Board'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an board
 */
exports.create = function (req, res) {
  var board = new Board(req.body);
  board.user = req.user;

  board.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(board);
    }
  });
};

/**
 * Show the current board
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var board = req.board ? req.board.toJSON() : {};

  // Add a custom field to the Board, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Board model.
  board.isCurrentUserOwner = !!(req.user && board.user && board.user._id.toString() === req.user._id.toString());

  res.json(board);
};

/**
 * Update an board
 */
exports.update = function (req, res) {
  var board = req.board;

  board.title = req.body.title;
  board.content = req.body.content;

  board.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(board);
    }
  });
};

/**
 * Delete an board
 */
exports.delete = function (req, res) {
  var board = req.board;

  board.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(board);
    }
  });
};

/**
 * List of Boards
 */
exports.list = function (req, res) {
  Board.find().sort('-created').populate('user', 'displayName').exec(function (err, boards) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(boards);
    }
  });
};

/**
 * Board middleware
 */
exports.boardByID = function (req, res, next, id) {

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
        message: 'No board with that identifier has been found'
      });
    }
    req.board = board;
    next();
  });
};
