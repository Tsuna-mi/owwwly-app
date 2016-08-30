(function (app) {
  'use strict';

  app.registerModule('boards', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('boards.admin', ['core.admin']);
  app.registerModule('boards.admin.routes', ['core.admin.routes']);
  app.registerModule('boards.services');
  app.registerModule('boards.routes', ['ui.router', 'core.routes', 'boards.services']);
}(ApplicationConfiguration));
