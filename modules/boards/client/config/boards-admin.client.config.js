(function () {
  'use strict';

  // Configuring the Boards Admin module
  angular
    .module('boards.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Boards',
      state: 'admin.boards.list'
    });
  }
}());
