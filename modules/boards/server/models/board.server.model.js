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
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Please fill Title Board'
  },
  category: {
    type: String,
    enum: ['Restaurant', 'Movie', 'Concert', 'Beach', 'Nature', 'Trip', 'Night', 'Other']
  },
  private:{
    boolean: false
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  dateEvent: {
    type: Date,
  },
  timeEvent: {
    type: Date,
  },
  city: {
    type: String,
    default: '',
    trim: true
  },
  url: {
    type: String,
    default: '',
    trim: true
  },
  image: {
    type: String,
    default: '',
    trim: true
  },
  userId: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  username: {
    type: String
  }

});


mongoose.model('Board', BoardSchema);
module.exports = Board;

