(function () {
  'use strict';

  // Boards controller
  angular
    .module('boards')
    .controller('BoardsController', BoardsController);

  BoardsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'boardResolve', '$filter'];

  function BoardsController ($scope, $state, $window, Authentication, board, $filter) {
    var vm = this;

    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.board = board;

    if (vm.board.date === undefined) {
      vm.board.date = new Date();
    }
    if (vm.board.time === undefined) {
      vm.board.time = new Date(1970, 0, 1, 0, 0, 0);
    }

    vm.board.date = new Date($filter('date')(vm.board.date, 'yyyy-MM-dd'));
    // vm.board.time = $filter('date')(new Date(vm.board.time), 'HH:mm');

    vm.board.visibility = false;

    vm.board.user = vm.authentication.user.displayName;
    vm.board.isCurrentUserOwner = true;


    // Remove existing Board
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.board.$remove($state.go('boards.list'));
      }
    }

    // Save Board
    function save(isValid) {

      vm.board.date = new Date(vm.board.date);


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
