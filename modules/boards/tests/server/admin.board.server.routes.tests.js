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
describe('Board Admin CRUD tests', function () {
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
      roles: ['user', 'admin'],
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

  it('should be able to save an board if logged in', function (done) {
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

        // Save a new board
        agent.post('/api/boards')
          .send(board)
          .expect(200)
          .end(function (boardSaveErr, boardSaveRes) {
            // Handle board save error
            if (boardSaveErr) {
              return done(boardSaveErr);
            }

            // Get a list of boards
            agent.get('/api/boards')
              .end(function (boardsGetErr, boardsGetRes) {
                // Handle board save error
                if (boardsGetErr) {
                  return done(boardsGetErr);
                }

                // Get boards list
                var boards = boardsGetRes.body;

                // Set assertions
                (boards[0].user._id).should.equal(userId);
                (boards[0].title).should.match('Board Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an board if signed in', function (done) {
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

        // Save a new board
        agent.post('/api/boards')
          .send(board)
          .expect(200)
          .end(function (boardSaveErr, boardSaveRes) {
            // Handle board save error
            if (boardSaveErr) {
              return done(boardSaveErr);
            }

            // Update board title
            board.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing board
            agent.put('/api/boards/' + boardSaveRes.body._id)
              .send(board)
              .expect(200)
              .end(function (boardUpdateErr, boardUpdateRes) {
                // Handle board update error
                if (boardUpdateErr) {
                  return done(boardUpdateErr);
                }

                // Set assertions
                (boardUpdateRes.body._id).should.equal(boardSaveRes.body._id);
                (boardUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an board if no title is provided', function (done) {
    // Invalidate title field
    board.title = '';

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

        // Save a new board
        agent.post('/api/boards')
          .send(board)
          .expect(400)
          .end(function (boardSaveErr, boardSaveRes) {
            // Set message assertion
            (boardSaveRes.body.message).should.match('Title cannot be blank');

            // Handle board save error
            done(boardSaveErr);
          });
      });
  });

  it('should be able to delete an board if signed in', function (done) {
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

        // Save a new board
        agent.post('/api/boards')
          .send(board)
          .expect(200)
          .end(function (boardSaveErr, boardSaveRes) {
            // Handle board save error
            if (boardSaveErr) {
              return done(boardSaveErr);
            }

            // Delete an existing board
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

  it('should be able to get a single board if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new board model instance
    board.user = user;
    var boardObj = new Board(board);

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

        // Save a new board
        agent.post('/api/boards')
          .send(board)
          .expect(200)
          .end(function (boardSaveErr, boardSaveRes) {
            // Handle board save error
            if (boardSaveErr) {
              return done(boardSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (boardInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
