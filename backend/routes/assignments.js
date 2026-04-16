'use strict';

const express    = require('express');
const auth       = require('../middleware/auth');
const Assignment = require('../models/Assignment');
const Course     = require('../models/Course');

const router = express.Router();

// ── POST /api/assignments ──────────────────────────────────────────────────────
// Teacher creates an assignment for one of their courses.
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher')
      return res.status(403).json({ message: 'Only teachers can create assignments.' });

    const { courseId, title, description, deadline, totalMarks } = req.body;
    if (!courseId || !title || !description || !deadline || !totalMarks)
      return res.status(400).json({ message: 'All fields are required.' });

    const course = await Course.findById(courseId);
    if (!course)
      return res.status(404).json({ message: 'Course not found.' });

    if (course.teacherId.toString() !== req.user.id)
      return res.status(403).json({ message: 'You can only create assignments for your own courses.' });

    const assignment = await Assignment.create({
      courseId,
      title,
      description,
      deadline,
      totalMarks: Number(totalMarks),
    });

    res.status(201).json(assignment);
  } catch (err) {
    console.error('Create assignment error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/assignments/course/:courseId ──────────────────────────────────────
// Returns all assignments for a course, newest first.
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const assignments = await Assignment
      .find({ courseId: req.params.courseId })
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    console.error('Get assignments error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/assignments/:id ───────────────────────────────────────────────────
// Returns a single assignment by ID.
router.get('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment)
      return res.status(404).json({ message: 'Assignment not found.' });
    res.json(assignment);
  } catch (err) {
    console.error('Get assignment error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
