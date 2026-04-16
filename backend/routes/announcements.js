'use strict';

const express      = require('express');
const auth         = require('../middleware/auth');
const Announcement = require('../models/Announcement');
const Course       = require('../models/Course');
const User         = require('../models/User');

const router = express.Router();

// ── POST /api/announcements ────────────────────────────────────────────────────
// Teacher posts an announcement to one of their courses.
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher')
      return res.status(403).json({ message: 'Only teachers can post announcements.' });

    const { courseId, text } = req.body;
    if (!courseId || !text)
      return res.status(400).json({ message: 'courseId and text are required.' });

    const course = await Course.findById(courseId);
    if (!course)
      return res.status(404).json({ message: 'Course not found.' });

    if (course.teacherId.toString() !== req.user.id)
      return res.status(403).json({ message: 'You can only post announcements in your own courses.' });

    const teacher      = await User.findById(req.user.id).select('name');
    const announcement = await Announcement.create({ courseId, text, teacherName: teacher.name });

    res.status(201).json(announcement);
  } catch (err) {
    console.error('Post announcement error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/announcements/course/:courseId ────────────────────────────────────
// Returns all announcements for a course, newest first.
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const announcements = await Announcement
      .find({ courseId: req.params.courseId })
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    console.error('Get announcements error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
