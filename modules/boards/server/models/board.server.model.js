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
    enum: ['restaurant', 'movie', 'concert', 'nature', 'trip', 'night', 'other']
  },
  visibility:{
    private: Boolean
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
  date: {
    type: Date,
    default: Date.now
  },
  time: {
    type: Date
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
// module.exports = Board;

