const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    unique: true,
    enum: ['hero', 'about', 'mission', 'vision', 'services', 'cta', 'footer']
  },
  title: {
    type: String
  },
  subtitle: {
    type: String
  },
  content: {
    type: String
  },
  items: [{
    title: String,
    description: String,
    icon: String,
    image: String
  }],
  images: [{
    url: String,
    alt: String
  }],
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  aiPrompt: {
    type: String
  },
  lastGeneratedAt: {
    type: Date
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SiteContent', siteContentSchema);
