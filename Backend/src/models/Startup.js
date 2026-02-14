const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema({
  founderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One startup per founder
  },
  name: {
    type: String,
    required: [true, 'Startup name is required'],
    trim: true,
    minlength: [2, 'Startup name must be at least 2 characters'],
    maxlength: [100, 'Startup name cannot exceed 100 characters']
  },
  logo: {
    type: String,
    default: null // Cloudinary URL
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    enum: [
      'SaaS',
      'AI/ML',
      'Fintech',
      'EdTech',
      'HealthTech',
      'E-commerce',
      'Gaming',
      'Blockchain',
      'IoT',
      'Cybersecurity',
      'Marketing',
      'Social Media',
      'Real Estate',
      'Travel',
      'Food & Beverage',
      'Enterprise',
      'Developer Tools',
      'Other'
    ]
  },
  website: {
    type: String,
    trim: true,
    match: [/^(https?:\/\/).*/, 'Please provide a valid website URL']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  stage: {
    type: String,
    required: [true, 'Funding stage is required'],
    enum: [
      'Idea Phase',
      'MVP/Pre-seed',
      'Seed',
      'Series A+',
      'Growth Stage'
    ]
  },
  teamSize: {
    type: String,
    required: [true, 'Team size is required'],
    enum: [
      '1-5',
      '6-10',
      '11-20',
      '21-50',
      '51-100',
      '100+'
    ]
  },
  tagline: {
    type: String,
    trim: true,
    maxlength: [150, 'Tagline cannot exceed 150 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  linkedin: {
    type: String,
    trim: true,
    match: [/^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/, 'Please provide a valid LinkedIn URL']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
startupSchema.index({ founderId: 1 });
startupSchema.index({ industry: 1 });
startupSchema.index({ stage: 1 });
startupSchema.index({ location: 1 });
startupSchema.index({ name: 'text', tagline: 'text', description: 'text' });

module.exports = mongoose.model('Startup', startupSchema);
