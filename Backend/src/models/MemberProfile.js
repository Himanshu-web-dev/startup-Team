const mongoose = require('mongoose');

const memberProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  currentRole: {
    type: String,
    trim: true,
    maxlength: [100, 'Current role cannot exceed 100 characters']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  yearsExperience: {
    type: Number,
    min: [0, 'Years of experience cannot be negative'],
    max: [50, 'Years of experience seems too high']
  },
  linkedin: {
    type: String,
    trim: true,
    match: [/^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/, 'Please provide a valid LinkedIn URL']
  },
  github: {
    type: String,
    trim: true,
    match: [/^(https?:\/\/)?(www\.)?github\.com\/.*$/, 'Please provide a valid GitHub URL']
  },
  skills: [{
    type: String,
    trim: true
  }],
  bio: {
    type: String,
    trim: true,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  portfolio: {
    type: String,
    trim: true,
    match: [/^(https?:\/\/).*/, 'Please provide a valid URL']
  },
  completionStatus: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index
memberProfileSchema.index({ userId: 1 });
memberProfileSchema.index({ skills: 1 });

// Update completion status
memberProfileSchema.pre('save', function(next) {
  const requiredFields = ['currentRole', 'yearsExperience', 'skills', 'bio'];
  const filled = requiredFields.every(field => {
    if (field === 'skills') return this.skills && this.skills.length > 0;
    return this[field] !== undefined && this[field] !== null;
  });
  this.completionStatus = filled;
  next();
});

module.exports = mongoose.model('MemberProfile', memberProfileSchema);
