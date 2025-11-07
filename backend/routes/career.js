const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  applyJob,
  getApplications,
  getApplication,
  updateApplicationStatus,
  downloadApplicationPDF
} = require('../controllers/careerController');
const { protect, authorize } = require('../middleware/auth');
const { uploadResume, handleUploadError } = require('../middleware/upload');

// Public routes
router.get('/jobs', getJobs);
router.get('/jobs/:id', getJob);
router.post('/apply/:jobId', uploadResume, handleUploadError, applyJob);

// Protected routes (Admin/Recruiter)
router.post('/jobs', protect, authorize('admin', 'recruiter'), createJob);
router.put('/jobs/:id', protect, authorize('admin', 'recruiter'), updateJob);
router.delete('/jobs/:id', protect, authorize('admin'), deleteJob);

router.get('/applications', protect, authorize('admin', 'recruiter'), getApplications);
router.get('/applications/:id', protect, authorize('admin', 'recruiter'), getApplication);
router.get('/applications/:id/download', protect, authorize('admin', 'recruiter'), downloadApplicationPDF);
router.put('/applications/:id/status', protect, authorize('admin', 'recruiter'), updateApplicationStatus);

module.exports = router;
