(function () {
  'use strict';

  angular
    .module('boards.services')
    .factory('BoardsService', BoardsService);

  BoardsService.$inject = ['$resource'];

  function BoardsService($resource) {
    var Board = $resource('api/boards/:boardId', {
      boardId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Board.prototype, {
      createOrUpdate: function () {
        var board = this;
        return createOrUpdate(board);
      }
    });

    return Board;

    function createOrUpdate(board) {
      if (board._id) {
        return board.$update(onSuccess, onError);
      } else {
        return board.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(board) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      console.log(error);
    }
  }
}());
