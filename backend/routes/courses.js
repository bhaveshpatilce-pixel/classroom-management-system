'use strict';

const express    = require('express');
const auth       = require('../middleware/auth');
const Course     = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User       = require('../models/User');

const router = express.Router();

// ── Helper: generate a unique 6-char course code ───────────────────────────────
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const generateCode = async () => {
  let code, exists;
  do {
    code = Array.from({ length: 6 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
    exists = await Course.findOne({ code });
  } while (exists);
  return code;
};

// ── POST /api/courses ──────────────────────────────────────────────────────────
// Teacher creates a new course with an auto-generated join code.
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher')
      return res.status(403).json({ message: 'Only teachers can create courses.' });

    const { name, description } = req.body;
    if (!name || !description)
      return res.status(400).json({ message: 'Course name and description are required.' });

    const course = await Course.create({
      name,
      description,
      teacherId: req.user.id,
      code: await generateCode(),
    });

    res.status(201).json(course);
  } catch (err) {
    console.error('Create course error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/courses/my ────────────────────────────────────────────────────────
// Returns all courses owned by the authenticated teacher.
router.get('/my', auth, async (req, res) => {
  try {
    const courses = await Course.find({ teacherId: req.user.id }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error('Get my courses error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/courses/enrolled/me ──────────────────────────────────────────────
// Returns all courses the authenticated student is enrolled in.
router.get('/enrolled/me', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id });
    const courseIds   = enrollments.map((e) => e.courseId);
    const courses     = await Course.find({ _id: { $in: courseIds } }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error('Get enrolled courses error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/courses/code/:code ────────────────────────────────────────────────
// Looks up a course by its join code (case-insensitive).
router.get('/code/:code', auth, async (req, res) => {
  try {
    const course = await Course.findOne({ code: req.params.code.toUpperCase() });
    if (!course)
      return res.status(404).json({ message: 'No course found with that code.' });
    res.json(course);
  } catch (err) {
    console.error('Find by code error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/courses/:id ───────────────────────────────────────────────────────
// Returns a single course by its MongoDB ID.
router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course)
      return res.status(404).json({ message: 'Course not found.' });
    res.json(course);
  } catch (err) {
    console.error('Get course error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── POST /api/courses/:id/enroll ──────────────────────────────────────────────
// Enrolls the authenticated student in a course.
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student')
      return res.status(403).json({ message: 'Only students can enroll in courses.' });

    const course = await Course.findById(req.params.id);
    if (!course)
      return res.status(404).json({ message: 'Course not found.' });

    const existing = await Enrollment.findOne({ courseId: req.params.id, userId: req.user.id });
    if (existing)
      return res.status(400).json({ message: 'You are already enrolled in this course.' });

    await Enrollment.create({ courseId: req.params.id, userId: req.user.id });
    res.json({ message: 'Successfully enrolled in the course.' });
  } catch (err) {
    console.error('Enroll error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/courses/:id/students ─────────────────────────────────────────────
// Returns the list of students enrolled in a course (password excluded).
router.get('/:id/students', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ courseId: req.params.id });
    const studentIds  = enrollments.map((e) => e.userId);
    const students    = await User.find({ _id: { $in: studentIds } }).select('-password');
    res.json(students);
  } catch (err) {
    console.error('Get students error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
