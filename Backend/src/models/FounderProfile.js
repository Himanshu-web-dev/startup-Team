const mongoose = require('mongoose');

const founderProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  experience: {
    type: String,
    trim: true,
    maxlength: [500, 'Experience description cannot exceed 500 characters']
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  skills: [{
    type: String,
    trim: true
  }],
  linkedin: {
    type: String,
    trim: true,
    match: [/^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/, 'Please provide a valid LinkedIn URL']
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
founderProfileSchema.index({ userId: 1 });

// Update completion status based on filled fields
founderProfileSchema.pre('save', function(next) {
  const requiredFields = ['experience', 'bio', 'skills', 'linkedin'];
  const filled = requiredFields.every(field => {
    if (field === 'skills') return this.skills && this.skills.length > 0;
    return this[field] && this[field].length > 0;
  });
  this.completionStatus = filled;
  next();
});

module.exports = mongoose.model('FounderProfile', founderProfileSchema);
