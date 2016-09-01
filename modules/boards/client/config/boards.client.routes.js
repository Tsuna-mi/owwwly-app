(function () {
  'use strict';

  angular
    .module('boards')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('boards', {
        abstract: true,
        url: '/boards',
        template: '<ui-view/>'
      })
      .state('boards.list', {
        url: '',
        templateUrl: 'modules/boards/client/views/list-boards.client.view.html',
        controller: 'BoardsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Boards List'
        }
      })
      .state('boards.create', {
        url: '/create',
        templateUrl: 'modules/boards/client/views/form-board.client.view.html',
        controller: 'BoardsController',
        controllerAs: 'vm',
        resolve: {
          boardResolve: newBoard
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Boards Create'
        }
      })
      .state('boards.edit', {
        url: '/:boardId/edit',
        templateUrl: 'modules/boards/client/views/form-board.client.view.html',
        controller: 'BoardsController',
        controllerAs: 'vm',
        resolve: {
          boardResolve: getBoard
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Board {{ boardResolve.name }}'
        }
      })
      .state('boards.view', {
        url: '/:boardId',
        templateUrl: 'modules/boards/client/views/view-board.client.view.html',
        controller: 'BoardsController',
        controllerAs: 'vm',
        resolve: {
          boardResolve: getBoard
        },
        data: {
          pageTitle: 'Board {{ boardResolve.name }}'
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
