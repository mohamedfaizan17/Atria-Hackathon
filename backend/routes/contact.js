const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// Public routes
router.post('/',
  validate({
    name: { required: true, minLength: 2 },
    email: { required: true, type: 'email' },
    subject: { required: true, minLength: 5 },
    message: { required: true, minLength: 10 }
  }),
  submitContact
);

// Protected routes (Admin)
router.get('/', protect, authorize('admin'), getContacts);
router.get('/:id', protect, authorize('admin'), getContact);
router.put('/:id', protect, authorize('admin'), updateContact);
router.delete('/:id', protect, authorize('admin'), deleteContact);

module.exports = router;
