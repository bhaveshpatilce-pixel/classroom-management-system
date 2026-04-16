'use strict';

const express    = require('express');
const auth       = require('../middleware/auth');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const Course     = require('../models/Course');
const User       = require('../models/User');

const router = express.Router();

// ── POST /api/submissions ──────────────────────────────────────────────────────
// Student submits work for an assignment (one submission per student per assignment).
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student')
      return res.status(403).json({ message: 'Only students can submit assignments.' });

    const { assignmentId, content } = req.body;
    if (!assignmentId || !content)
      return res.status(400).json({ message: 'assignmentId and content are required.' });

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment)
      return res.status(404).json({ message: 'Assignment not found.' });

    const duplicate = await Submission.findOne({ assignmentId, studentId: req.user.id });
    if (duplicate)
      return res.status(400).json({ message: 'You have already submitted this assignment.' });

    const student    = await User.findById(req.user.id).select('name');
    const submission = await Submission.create({
      assignmentId,
      studentId:   req.user.id,
      studentName: student.name,
      content,
    });

    res.status(201).json(submission);
  } catch (err) {
    console.error('Submit error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/submissions/teacher ──────────────────────────────────────────────
// Returns all submissions across the teacher's courses (newest first).
router.get('/teacher', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher')
      return res.status(403).json({ message: 'Only teachers can access this route.' });

    const courses     = await Course.find({ teacherId: req.user.id });
    const courseIds   = courses.map((c) => c._id);
    const assignments = await Assignment.find({ courseId: { $in: courseIds } });
    const assignIds   = assignments.map((a) => a._id);

    const submissions = await Submission
      .find({ assignmentId: { $in: assignIds } })
      .populate('assignmentId', 'title totalMarks courseId')
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (err) {
    console.error('Get teacher submissions error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/submissions/student/me ───────────────────────────────────────────
// Returns all submissions made by the authenticated student.
router.get('/student/me', auth, async (req, res) => {
  try {
    const submissions = await Submission
      .find({ studentId: req.user.id })
      .populate('assignmentId', 'title totalMarks courseId deadline')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    console.error('Get student submissions error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/submissions/assignment/:assignmentId ──────────────────────────────
// Returns all submissions for a specific assignment (teacher view).
router.get('/assignment/:assignmentId', auth, async (req, res) => {
  try {
    const submissions = await Submission
      .find({ assignmentId: req.params.assignmentId })
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    console.error('Get submissions error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/submissions/:id ───────────────────────────────────────────────────
// Returns a single submission by ID (used by grade modal).
router.get('/:id', auth, async (req, res) => {
  try {
    const submission = await Submission
      .findById(req.params.id)
      .populate('assignmentId', 'title totalMarks courseId');
    if (!submission)
      return res.status(404).json({ message: 'Submission not found.' });
    res.json(submission);
  } catch (err) {
    console.error('Get submission error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── PUT /api/submissions/:id/grade ────────────────────────────────────────────
// Teacher grades a submission by setting marks and optional feedback.
router.put('/:id/grade', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher')
      return res.status(403).json({ message: 'Only teachers can grade submissions.' });

    const { marks, feedback } = req.body;
    if (marks === undefined || marks === null || marks === '')
      return res.status(400).json({ message: 'Marks are required.' });

    const submission = await Submission.findById(req.params.id);
    if (!submission)
      return res.status(404).json({ message: 'Submission not found.' });

    submission.marks    = Number(marks);
    submission.feedback = feedback || '';
    submission.gradedAt = new Date();
    await submission.save();

    res.json(submission);
  } catch (err) {
    console.error('Grade error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
