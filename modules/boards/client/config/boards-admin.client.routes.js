(function () {
  'use strict';

  angular
    .module('boards.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.boards', {
        abstract: true,
        url: '/boards',
        template: '<ui-view/>'
      })
      .state('admin.boards.list', {
        url: '',
        templateUrl: 'modules/boards/client/views/admin/list-boards.client.view.html',
        controller: 'BoardsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.boards.create', {
        url: '/create',
        templateUrl: 'modules/boards/client/views/admin/form-board.client.view.html',
        controller: 'BoardsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          boardResolve: newBoard
        }
      })
      .state('admin.boards.edit', {
        url: '/:boardId/edit',
        templateUrl: 'modules/boards/client/views/admin/form-board.client.view.html',
        controller: 'BoardsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          boardResolve: getBoard
        }
      });
  }

  getBoard.$inject = ['$stateParams', 'BoardsService'];

  function getBoard($stateParams, BoardsService) {
    return BoardsService.get({
      boardId: $stateParams.boardId
    }).$promise;
  }

  newBoard.$inject = ['BoardsService'];

  function newBoard(BoardsService) {
    return new BoardsService();
  }
}());
