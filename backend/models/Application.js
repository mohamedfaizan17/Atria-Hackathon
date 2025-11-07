const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  // Personal Information
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
  // Additional Details
  linkedin: String,
  portfolio: String,
  currentLocation: String,
  yearsOfExperience: Number,
  expectedSalary: String,
  noticePeriod: String,
  
  // Application Documents
  resumeUrl: String,
  coverLetter: String,
  whyJoin: String,
  
  // ATS Status Tracking
  status: {
    type: String,
    enum: ['applied', 'under_review', 'shortlisted', 'interview_scheduled', 'interviewed', 'selected', 'rejected', 'offer_sent', 'offer_accepted', 'offer_rejected'],
    default: 'applied'
  },
  
  // ATS Scoring & Matching
  atsScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  skillsMatch: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  experienceMatch: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  // Candidate Tags
  tags: [String],
  
  // Review & Notes
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  reviewNotes: String,
  internalNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Interview Tracking
  interviews: [{
    round: Number,
    type: String, // 'phone', 'technical', 'hr', 'final'
    scheduledAt: Date,
    interviewer: String,
    feedback: String,
    rating: Number,
    status: String // 'scheduled', 'completed', 'cancelled'
  }],
  
  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now
  },
  lastStatusUpdate: {
    type: Date,
    default: Date.now
  },
  
  // Flags
  isFavorite: {
    type: Boolean,
    default: false
  },
  isViewed: {
    type: Boolean,
    default: false
  },
  
  // Source Tracking
  source: {
    type: String,
    default: 'website'
  }
}, {
  timestamps: true
});

// Indexes for faster queries
applicationSchema.index({ job: 1, email: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ atsScore: -1 });
applicationSchema.index({ submittedAt: -1 });
applicationSchema.index({ email: 1 });

// Update lastStatusUpdate when status changes
applicationSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.lastStatusUpdate = Date.now();
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
