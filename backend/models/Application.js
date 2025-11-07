const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    linkedin: String,
    portfolio: String
  },
  resume: {
    filename: String,
    path: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  coverLetter: {
    type: String
  },
  aiScore: {
    overall: {
      type: Number,
      min: 0,
      max: 100
    },
    skillMatch: {
      type: Number,
      min: 0,
      max: 100
    },
    experienceMatch: {
      type: Number,
      min: 0,
      max: 100
    },
    educationMatch: {
      type: Number,
      min: 0,
      max: 100
    },
    analysis: String,
    recommendations: [String]
  },
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'shortlisted', 'rejected', 'accepted'],
    default: 'submitted'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewNotes: String
}, {
  timestamps: true
});

// Index for faster queries
applicationSchema.index({ job: 1, 'applicant.email': 1 });
applicationSchema.index({ status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
