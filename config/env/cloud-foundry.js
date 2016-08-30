'use strict';

var cfenv = require('cfenv'),
  appEnv = cfenv.getAppEnv();
var cfMongoUrl = (function() {
  if (appEnv.getService('owwwly-mongo')) {
    var mongoCreds = appEnv.getService('owwwly-mongo').credentials;
    return mongoCreds.uri || mongoCreds.url;
  } else {
    throw new Error('No service names "owwwly-mongo" bound to the application.');
  }
}());

var getCred = function (serviceName, credProp) {
  return appEnv.getService(serviceName) ?
    appEnv.getService(serviceName).credentials[credProp] : undefined;
};

module.exports = {
  port: appEnv.port,
  db: {
    uri: cfMongoUrl,
    options: {
      user: '',
      pass: ''
    }
  },
  log: {
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'combined',
    // Stream defaults to process.stdout
    // By default we want logs to go to process.out so the Cloud Foundry Loggregator will collect them
    options: {}
  },
  facebook: {
    clientID: getCred('owwwly-facebook', 'id') || 'APP_ID',
    clientSecret: getCred('owwwly-facebook', 'secret') || 'APP_SECRET',
    callbackURL: '/api/auth/facebook/callback'
  },
  twitter: {
    clientID: getCred('owwwly-twitter', 'key') || 'CONSUMER_KEY',
    clientSecret: getCred('owwwly-twitter', 'secret') || 'CONSUMER_SECRET',
    callbackURL: '/api/auth/twitter/callback'
  },
  google: {
    clientID: getCred('owwwly-google', 'id') || 'APP_ID',
    clientSecret: getCred('owwwly-google', 'secret') || 'APP_SECRET',
    callbackURL: '/api/auth/google/callback'
  },
  linkedin: {
    clientID: getCred('owwwly-linkedin', 'id') || 'APP_ID',
    clientSecret: getCred('owwwly-linkedin', 'secret') || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback'
  },
  github: {
    clientID: getCred('owwwly-github', 'id') || 'APP_ID',
    clientSecret: getCred('owwwly-github', 'secret') || 'APP_SECRET',
    callbackURL: '/api/auth/github/callback'
  },
  paypal: {
    clientID: getCred('owwwly-paypal', 'id') || 'CLIENT_ID',
    clientSecret: getCred('owwwly-paypal', 'secret') || 'CLIENT_SECRET',
    callbackURL: '/api/auth/paypal/callback',
    sandbox: false
  },
  mailer: {
    from: getCred('owwwly-mail', 'from') || 'MAILER_FROM',
    options: {
      service: getCred('owwwly-mail', 'service') || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: getCred('owwwly-mail', 'username') || 'MAILER_EMAIL_ID',
        pass: getCred('owwwly-mail', 'password') || 'MAILER_PASSWORD'
      }
    }
  },
  seedDB: {
    seed: process.env.MONGO_SEED === 'true',
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS !== 'false',
      seedUser: {
        username: process.env.MONGO_SEED_USER_USERNAME || 'user',
        provider: 'local',
        email: process.env.MONGO_SEED_USER_EMAIL || 'user@localhost.com',
        firstName: 'User',
        lastName: 'Local',
        displayName: 'User Local',
        roles: ['user']
      },
      seedAdmin: {
        username: process.env.MONGO_SEED_ADMIN_USERNAME || 'admin',
        provider: 'local',
        email: process.env.MONGO_SEED_ADMIN_EMAIL || 'admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin']
      }
    }
  }
};
