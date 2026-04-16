'use strict';

const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Assignment',
      required: true,
    },
    studentId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    studentName: {
      type:     String,
      required: true,
      trim:     true,
    },
    content: {
      type:     String,
      required: [true, 'Submission content is required'],
      trim:     true,
    },
    marks: {
      type:    Number,
      default: null,
    },
    feedback: {
      type:    String,
      default: '',
      trim:    true,
    },
    gradedAt: {
      type:    Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Prevent duplicate submissions per student per assignment
submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
