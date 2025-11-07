const express = require('express');
const router = express.Router();
const {
  getAllApplications,
  getApplication,
  updateStatus,
  addNote,
  scheduleInterview,
  updateInterview,
  toggleFavorite,
  addTags,
  scoreCandidate,
  bulkScore,
  getStatistics
} = require('../controllers/atsController');
const { protect, authorize } = require('../middleware/auth');

// Protect all ATS routes - admin only
router.use(protect);
router.use(authorize('admin'));

// Statistics
router.get('/statistics', getStatistics);

// Applications
router.get('/applications', getAllApplications);
router.get('/applications/:id', getApplication);

// Status management
router.put('/applications/:id/status', updateStatus);

// Notes
router.post('/applications/:id/notes', addNote);

// Interview management
router.post('/applications/:id/interviews', scheduleInterview);
router.put('/applications/:id/interviews', updateInterview);

// Candidate management
router.put('/applications/:id/favorite', toggleFavorite);
router.put('/applications/:id/tags', addTags);

// AI Scoring
router.post('/applications/:id/score', scoreCandidate);
router.post('/bulk-score', bulkScore);

module.exports = router;
