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
          mainstate = $state.get('boards');
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
          liststate = $state.get('boards.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('modules/boards/client/views/list-boards.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          BoardsController,
          mockBoard;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('boards.view');
          $templateCache.put('modules/boards/client/views/view-board.client.view.html', '');

          // create mock board
          mockBoard = new BoardsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Board about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          BoardsController = $controller('BoardsController as vm', {
            $scope: $scope,
            boardResolve: mockBoard
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:boardId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.boardResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            boardId: 1
          })).toEqual('/boards/1');
        }));

        it('should attach an board to the controller scope', function () {
          expect($scope.vm.board._id).toBe(mockBoard._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/boards/client/views/view-board.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('boards.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('boards/');
          $rootScope.$digest();

          expect($location.path()).toBe('/boards');
          expect($state.current.templateUrl).toBe('modules/boards/client/views/list-boards.client.view.html');
        }));
      });
    });
  });
}());
