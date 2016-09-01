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

    // Save a user to the test db and create new Board
    user.save(function () {
      board = {
        name: 'Board name'
      };

      done();
    });
  });

  it('should be able to save a Board if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Board
        agent.post('/api/boards')
          .send(board)
          .expect(200)
          .end(function (boardSaveErr, boardSaveRes) {
            // Handle Board save error
            if (boardSaveErr) {
              return done(boardSaveErr);
            }

            // Get a list of Boards
            agent.get('/api/boards')
              .end(function (boardsGetErr, boardsGetRes) {
                // Handle Boards save error
                if (boardsGetErr) {
                  return done(boardsGetErr);
                }

                // Get Boards list
                var boards = boardsGetRes.body;

                // Set assertions
                (boards[0].user._id).should.equal(userId);
                (boards[0].name).should.match('Board name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Board if not logged in', function (done) {
    agent.post('/api/boards')
      .send(board)
      .expect(403)
      .end(function (boardSaveErr, boardSaveRes) {
        // Call the assertion callback
        done(boardSaveErr);
      });
  });

  it('should not be able to save an Board if no name is provided', function (done) {
    // Invalidate name field
    board.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Board
        agent.post('/api/boards')
          .send(board)
          .expect(400)
          .end(function (boardSaveErr, boardSaveRes) {
            // Set message assertion
            (boardSaveRes.body.message).should.match('Please fill Board name');

            // Handle Board save error
            done(boardSaveErr);
          });
      });
  });

  it('should be able to update an Board if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Board
        agent.post('/api/boards')
          .send(board)
          .expect(200)
          .end(function (boardSaveErr, boardSaveRes) {
            // Handle Board save error
            if (boardSaveErr) {
              return done(boardSaveErr);
            }

            // Update Board name
            board.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Board
            agent.put('/api/boards/' + boardSaveRes.body._id)
              .send(board)
              .expect(200)
              .end(function (boardUpdateErr, boardUpdateRes) {
                // Handle Board update error
                if (boardUpdateErr) {
                  return done(boardUpdateErr);
                }

                // Set assertions
                (boardUpdateRes.body._id).should.equal(boardSaveRes.body._id);
                (boardUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Boards if not signed in', function (done) {
    // Create new Board model instance
    var boardObj = new Board(board);

    // Save the board
    boardObj.save(function () {
      // Request Boards
      request(app).get('/api/boards')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Board if not signed in', function (done) {
    // Create new Board model instance
    var boardObj = new Board(board);

    // Save the Board
    boardObj.save(function () {
      request(app).get('/api/boards/' + boardObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', board.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Board with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/boards/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Board is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Board which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Board
    request(app).get('/api/boards/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Board with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Board if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Board
        agent.post('/api/boards')
          .send(board)
          .expect(200)
          .end(function (boardSaveErr, boardSaveRes) {
            // Handle Board save error
            if (boardSaveErr) {
              return done(boardSaveErr);
            }

            // Delete an existing Board
            agent.delete('/api/boards/' + boardSaveRes.body._id)
              .send(board)
              .expect(200)
              .end(function (boardDeleteErr, boardDeleteRes) {
                // Handle board error error
                if (boardDeleteErr) {
                  return done(boardDeleteErr);
                }

                // Set assertions
                (boardDeleteRes.body._id).should.equal(boardSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Board if not signed in', function (done) {
    // Set Board user
    board.user = user;

    // Create new Board model instance
    var boardObj = new Board(board);

    // Save the Board
    boardObj.save(function () {
      // Try deleting Board
      request(app).delete('/api/boards/' + boardObj._id)
        .expect(403)
        .end(function (boardDeleteErr, boardDeleteRes) {
          // Set message assertion
          (boardDeleteRes.body.message).should.match('User is not authorized');

          // Handle Board error error
          done(boardDeleteErr);
        });

    });
  });

  it('should be able to get a single Board that has an orphaned user reference', function (done) {
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
      provider: 'local'
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

          // Save a new Board
          agent.post('/api/boards')
            .send(board)
            .expect(200)
            .end(function (boardSaveErr, boardSaveRes) {
              // Handle Board save error
              if (boardSaveErr) {
                return done(boardSaveErr);
              }

              // Set assertions on new Board
              (boardSaveRes.body.name).should.equal(board.name);
              should.exist(boardSaveRes.body.user);
              should.equal(boardSaveRes.body.user._id, orphanId);

              // force the Board to have an orphaned user reference
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

                    // Get the Board
                    agent.get('/api/boards/' + boardSaveRes.body._id)
                      .expect(200)
                      .end(function (boardInfoErr, boardInfoRes) {
                        // Handle Board error
                        if (boardInfoErr) {
                          return done(boardInfoErr);
                        }

                        // Set assertions
                        (boardInfoRes.body._id).should.equal(boardSaveRes.body._id);
                        (boardInfoRes.body.name).should.equal(board.name);
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

  afterEach(function (done) {
    User.remove().exec(function () {
      Board.remove().exec(done);
    });
  });
});
