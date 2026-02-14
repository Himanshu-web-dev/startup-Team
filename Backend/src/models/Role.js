const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  startupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Startup',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Role title is required'],
    trim: true,
    maxlength: [100, 'Role title cannot exceed 100 characters']
  },
  experienceLevel: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: [
      'Fresher (0-1 Years)',
      'Junior (1-2 Years)',
      'Mid-Level (3-5 Years)',
      'Senior (5+ Years)',
      'Lead/Principal (8+ Years)',
      'Any'
    ]
  },
  salaryRange: {
    type: String,
    trim: true,
    maxlength: [100, 'Salary range cannot exceed 100 characters']
  },
  employmentType: {
    type: String,
    required: [true, 'Employment type is required'],
    enum: ['Full-Time', 'Part-Time', 'Remote', 'Contract', 'Internship']
  },
  skills: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    required: [true, 'Role description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'filled'],
    default: 'open'
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  applicationsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
roleSchema.index({ startupId: 1 });
roleSchema.index({ status: 1 });
roleSchema.index({ postedDate: -1 });
roleSchema.index({ skills: 1 });

module.exports = mongoose.model('Role', roleSchema);
