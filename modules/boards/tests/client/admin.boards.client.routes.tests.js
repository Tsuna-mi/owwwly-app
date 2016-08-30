(function () {
  'use strict';

  describe('Boards Route Tests', function () {
    // Initialize global variables
    var $scope,
      BoardsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _BoardsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      BoardsService = _BoardsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.boards');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/boards');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('admin.boards.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('modules/boards/client/views/admin/list-boards.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          BoardsAdminController,
          mockBoard;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.boards.create');
          $templateCache.put('modules/boards/client/views/admin/form-board.client.view.html', '');

          // Create mock board
          mockBoard = new BoardsService();

          // Initialize Controller
          BoardsAdminController = $controller('BoardsAdminController as vm', {
            $scope: $scope,
            boardResolve: mockBoard
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.boardResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/boards/create');
        }));

        it('should attach an board to the controller scope', function () {
          expect($scope.vm.board._id).toBe(mockBoard._id);
          expect($scope.vm.board._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/boards/client/views/admin/form-board.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          BoardsAdminController,
          mockBoard;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.boards.edit');
          $templateCache.put('modules/boards/client/views/admin/form-board.client.view.html', '');

          // Create mock board
          mockBoard = new BoardsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Board about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          BoardsAdminController = $controller('BoardsAdminController as vm', {
            $scope: $scope,
            boardResolve: mockBoard
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:boardId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.boardResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            boardId: 1
          })).toEqual('/admin/boards/1/edit');
        }));

        it('should attach an board to the controller scope', function () {
          expect($scope.vm.board._id).toBe(mockBoard._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/boards/client/views/admin/form-board.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
