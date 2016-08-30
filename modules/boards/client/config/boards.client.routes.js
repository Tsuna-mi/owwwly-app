(function () {
  'use strict';

  angular
    .module('boards.routes')
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
      .state('boards.view', {
        url: '/:boardId',
        templateUrl: 'modules/boards/client/views/view-board.client.view.html',
        controller: 'BoardsController',
        controllerAs: 'vm',
        resolve: {
          boardResolve: getBoard
        },
        data: {
          pageTitle: 'Board {{ boardResolve.title }}'
        }
      });
  }

  getBoard.$inject = ['$stateParams', 'BoardsService'];

  function getBoard($stateParams, BoardsService) {
    return BoardsService.get({
      boardId: $stateParams.boardId
    }).$promise;
  }
}());
