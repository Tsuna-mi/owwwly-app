(function () {
  'use strict';

  angular
    .module('boards')
    .controller('BoardsListController', BoardsListController);

  BoardsListController.$inject = ['BoardsService'];

  function BoardsListController(BoardsService) {
    var vm = this;

    vm.boards = BoardsService.query();
  }
}());
