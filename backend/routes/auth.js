const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// Public routes
router.post('/register', 
  validate({
    name: { required: true, minLength: 2 },
    email: { required: true, type: 'email' },
    password: { required: true, minLength: 6 }
  }),
  register
);

router.post('/login',
  validate({
    email: { required: true, type: 'email' },
    password: { required: true }
  }),
  login
);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
