const express = require('express');
const router = express.Router();
const {
  trackPageView,
  trackConversion,
  getAnalytics,
  getAnalyticsSummary
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

// Public routes (for tracking)
router.post('/track', trackPageView);
router.post('/conversion', trackConversion);

// Protected routes (Admin)
router.get('/', protect, authorize('admin'), getAnalytics);
router.get('/summary', protect, authorize('admin'), getAnalyticsSummary);

module.exports = router;
