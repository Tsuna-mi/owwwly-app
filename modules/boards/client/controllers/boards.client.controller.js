(function () {
  'use strict';

  // Boards controller
  angular
    .module('boards')
    .controller('BoardsController', BoardsController);

  BoardsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'boardResolve'];

  function BoardsController ($scope, $state, $window, Authentication, board) {
    var vm = this;

    vm.authentication = Authentication;
    vm.board = board;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Board
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.board.$remove($state.go('boards.list'));
      }
    }

    // Save Board
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.boardForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.board._id) {
        vm.board.$update(successCallback, errorCallback);
      } else {
        vm.board.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('boards.view', {
          boardId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
