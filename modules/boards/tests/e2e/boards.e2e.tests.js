'use strict';

describe('Boards E2E Tests:', function () {
  describe('Test Boards page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/boards');
      expect(element.all(by.repeater('board in boards')).count()).toEqual(0);
    });
  });
});
