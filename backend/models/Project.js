const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  aiGeneratedSummary: {
    type: String
  },
  client: {
    type: String
  },
  industry: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  technologies: [{
    type: String
  }],
  images: [{
    url: String,
    caption: String
  }],
  thumbnailImage: {
    type: String
  },
  demoUrl: {
    type: String
  },
  githubUrl: {
    type: String
  },
  duration: {
    type: String
  },
  teamSize: {
    type: Number
  },
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'planned'],
    default: 'completed'
  },
  featured: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  testimonial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Testimonial'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
