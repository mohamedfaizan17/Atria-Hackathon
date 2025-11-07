const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  pageViews: {
    type: Number,
    default: 0
  },
  uniqueVisitors: {
    type: Number,
    default: 0
  },
  pageData: [{
    page: String,
    views: Number,
    avgTimeSpent: Number
  }],
  sources: [{
    source: String,
    count: Number
  }],
  devices: {
    desktop: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 }
  },
  browsers: [{
    name: String,
    count: Number
  }],
  topCountries: [{
    country: String,
    count: Number
  }],
  conversions: {
    contactForms: { type: Number, default: 0 },
    jobApplications: { type: Number, default: 0 },
    chatInteractions: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Index for faster queries
analyticsSchema.index({ date: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
