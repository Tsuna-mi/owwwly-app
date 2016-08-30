'use strict';

/**
 * Module dependencies
 */
var boardsPolicy = require('../policies/boards.server.policy'),
  boards = require('../controllers/boards.server.controller');

module.exports = function (app) {
  // Boards collection routes
  app.route('/api/boards').all(boardsPolicy.isAllowed)
    .get(boards.list)
    .post(boards.create);

  // Single board routes
  app.route('/api/boards/:boardId').all(boardsPolicy.isAllowed)
    .get(boards.read)
    .put(boards.update)
    .delete(boards.delete);

  // Finish by binding the board middleware
  app.param('boardId', boards.boardByID);
};
