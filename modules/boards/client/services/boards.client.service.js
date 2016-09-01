// Boards service used to communicate Boards REST endpoints
(function () {
  'use strict';

  angular
    .module('boards')
    .factory('BoardsService', BoardsService);

  BoardsService.$inject = ['$resource'];

  function BoardsService($resource) {
    return $resource('api/boards/:boardId', {
      boardId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
