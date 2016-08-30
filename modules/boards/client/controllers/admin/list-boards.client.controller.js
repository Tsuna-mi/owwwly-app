(function () {
  'use strict';

  angular
    .module('boards.admin')
    .controller('BoardsAdminListController', BoardsAdminListController);

  BoardsAdminListController.$inject = ['BoardsService'];

  function BoardsAdminListController(BoardsService) {
    var vm = this;

    vm.boards = BoardsService.query();
  }
}());
