(function () {
  'use strict';

  angular
    .module('boards')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Boards',
      state: 'boards',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'boards', {
      title: 'List Boards',
      state: 'boards.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'boards', {
      title: 'Create Board',
      state: 'boards.create',
      roles: ['user']
    });
  }
}());
