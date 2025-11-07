const express = require('express');
const router = express.Router();
const {
  generateContent,
  summarize,
  chat,
  analyzeResume,
  themeRecommendation,
  analyticsSummary
} = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/chat', chat);
router.post('/summarize', summarize);
router.post('/theme-recommendation', themeRecommendation);

// Protected routes (Admin only)
router.post('/generate-content', protect, authorize('admin'), generateContent);
router.post('/analyze-resume', protect, authorize('admin', 'recruiter'), analyzeResume);
router.post('/analytics-summary', protect, authorize('admin'), analyticsSummary);

module.exports = router;
