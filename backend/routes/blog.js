const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  generateBlogSummary,
  generateSEO
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getBlogs);
router.get('/:slug', getBlog);
router.post('/:id/like', likeBlog);

// AI Summary for visitors (public endpoint)
router.post('/:id/generate-summary', generateBlogSummary);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createBlog);
router.put('/:id', protect, authorize('admin'), updateBlog);
router.delete('/:id', protect, authorize('admin'), deleteBlog);

// AI SEO Generation (Admin only)
router.post('/generate-seo', protect, authorize('admin'), generateSEO);

module.exports = router;
