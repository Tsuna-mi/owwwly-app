(function () {
  'use strict';

  angular
    .module('boards.admin')
    .controller('BoardsAdminController', BoardsAdminController);

  BoardsAdminController.$inject = ['$scope', '$state', '$window', 'boardResolve', 'Authentication'];

  function BoardsAdminController($scope, $state, $window, board, Authentication) {
    var vm = this;

    vm.board = board;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Board
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.board.$remove($state.go('admin.boards.list'));
      }
    }

    // Save Board
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.boardForm');
        return false;
      }

      // Create a new board, or update the current instance
      vm.board.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.boards.list'); // should we send the User to the list or the updated Board's view?
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
