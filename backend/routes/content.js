const express = require('express');
const router = express.Router();
const {
  getSiteContent,
  updateSiteContent,
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/contentController');
const { protect, authorize } = require('../middleware/auth');

// Site Content Routes
router.get('/site', getSiteContent);
router.put('/site/:section', protect, authorize('admin'), updateSiteContent);

// Project Routes
router.get('/projects', getProjects);
router.get('/projects/:id', getProject);
router.post('/projects', protect, authorize('admin'), createProject);
router.put('/projects/:id', protect, authorize('admin'), updateProject);
router.delete('/projects/:id', protect, authorize('admin'), deleteProject);

// Testimonial Routes
router.get('/testimonials', getTestimonials);
router.get('/testimonials/:id', getTestimonial);
router.post('/testimonials', protect, authorize('admin'), createTestimonial);
router.put('/testimonials/:id', protect, authorize('admin'), updateTestimonial);
router.delete('/testimonials/:id', protect, authorize('admin'), deleteTestimonial);

module.exports = router;
