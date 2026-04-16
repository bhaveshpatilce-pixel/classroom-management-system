'use strict';

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Course name is required'],
      trim:     true,
    },
    description: {
      type:     String,
      required: [true, 'Course description is required'],
      trim:     true,
    },
    teacherId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    code: {
      type:      String,
      unique:    true,
      uppercase: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
