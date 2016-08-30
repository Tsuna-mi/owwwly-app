'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Board = mongoose.model('Board'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  board;

/**
 * Board routes tests
 */
describe('Board CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new board
    user.save(function () {
      board = {
        title: 'Board Title',
        content: 'Board Content'
      };

      done();
    });
  });

  it('should not be able to save an board if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/boards')
          .send(board)
          .expect(403)
          .end(function (boardSaveErr, boardSaveRes) {
            // Call the assertion callback
            done(boardSaveErr);
          });

      });
  });

  it('should not be able to save an board if not logged in', function (done) {
    agent.post('/api/boards')
      .send(board)
      .expect(403)
      .end(function (boardSaveErr, boardSaveRes) {
        // Call the assertion callback
        done(boardSaveErr);
      });
  });

  it('should not be able to update an board if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/boards')
          .send(board)
          .expect(403)
          .end(function (boardSaveErr, boardSaveRes) {
            // Call the assertion callback
            done(boardSaveErr);
          });
      });
  });

  it('should be able to get a list of boards if not signed in', function (done) {
    // Create new board model instance
    var boardObj = new Board(board);

    // Save the board
    boardObj.save(function () {
      // Request boards
      request(app).get('/api/boards')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single board if not signed in', function (done) {
    // Create new board model instance
    var boardObj = new Board(board);

    // Save the board
    boardObj.save(function () {
      request(app).get('/api/boards/' + boardObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', board.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single board with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/boards/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Board is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single board which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent board
    request(app).get('/api/boards/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No board with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an board if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/boards')
          .send(board)
          .expect(403)
          .end(function (boardSaveErr, boardSaveRes) {
            // Call the assertion callback
            done(boardSaveErr);
          });
      });
  });

  it('should not be able to delete an board if not signed in', function (done) {
    // Set board user
    board.user = user;

    // Create new board model instance
    var boardObj = new Board(board);

    // Save the board
    boardObj.save(function () {
      // Try deleting board
      request(app).delete('/api/boards/' + boardObj._id)
        .expect(403)
        .end(function (boardDeleteErr, boardDeleteRes) {
          // Set message assertion
          (boardDeleteRes.body.message).should.match('User is not authorized');

          // Handle board error error
          done(boardDeleteErr);
        });

    });
  });

  it('should be able to get a single board that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new board
          agent.post('/api/boards')
            .send(board)
            .expect(200)
            .end(function (boardSaveErr, boardSaveRes) {
              // Handle board save error
              if (boardSaveErr) {
                return done(boardSaveErr);
              }

              // Set assertions on new board
              (boardSaveRes.body.title).should.equal(board.title);
              should.exist(boardSaveRes.body.user);
              should.equal(boardSaveRes.body.user._id, orphanId);

              // force the board to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the board
                    agent.get('/api/boards/' + boardSaveRes.body._id)
                      .expect(200)
                      .end(function (boardInfoErr, boardInfoRes) {
                        // Handle board error
                        if (boardInfoErr) {
                          return done(boardInfoErr);
                        }

                        // Set assertions
                        (boardInfoRes.body._id).should.equal(boardSaveRes.body._id);
                        (boardInfoRes.body.title).should.equal(board.title);
                        should.equal(boardInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single board if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new board model instance
    var boardObj = new Board(board);

    // Save the board
    boardObj.save(function () {
      request(app).get('/api/boards/' + boardObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', board.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single board, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      username: 'boardowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Board
    var _boardOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _boardOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Board
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new board
          agent.post('/api/boards')
            .send(board)
            .expect(200)
            .end(function (boardSaveErr, boardSaveRes) {
              // Handle board save error
              if (boardSaveErr) {
                return done(boardSaveErr);
              }

              // Set assertions on new board
              (boardSaveRes.body.title).should.equal(board.title);
              should.exist(boardSaveRes.body.user);
              should.equal(boardSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the board
                  agent.get('/api/boards/' + boardSaveRes.body._id)
                    .expect(200)
                    .end(function (boardInfoErr, boardInfoRes) {
                      // Handle board error
                      if (boardInfoErr) {
                        return done(boardInfoErr);
                      }

                      // Set assertions
                      (boardInfoRes.body._id).should.equal(boardSaveRes.body._id);
                      (boardInfoRes.body.title).should.equal(board.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (boardInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Board.remove().exec(done);
    });
  });
});
