'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Board Schema
 */
var BoardSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Board name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Board', BoardSchema);
