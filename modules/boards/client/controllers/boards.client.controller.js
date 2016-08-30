(function () {
  'use strict';

  angular
    .module('boards')
    .controller('BoardsController', BoardsController);

  BoardsController.$inject = ['$scope', 'boardResolve', 'Authentication'];

  function BoardsController($scope, board, Authentication) {
    var vm = this;

    vm.board = board;
    vm.authentication = Authentication;
    vm.error = null;

  }
}());
