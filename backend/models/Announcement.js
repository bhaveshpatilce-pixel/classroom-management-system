'use strict';

const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    text: {
      type: String,
      required: [true, 'Announcement text is required'],
      trim: true,
    },
    teacherName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);
