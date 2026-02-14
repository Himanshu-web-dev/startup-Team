const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Startup',
    required: true
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'interview', 'accepted', 'rejected'],
    default: 'pending'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  coverLetter: {
    type: String,
    trim: true,
    maxlength: [1000, 'Cover letter cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate applications
applicationSchema.index({ memberId: 1, roleId: 1 }, { unique: true });
applicationSchema.index({ startupId: 1, status: 1 });
applicationSchema.index({ memberId: 1, status: 1 });
applicationSchema.index({ appliedDate: -1 });

// Update the updatedDate on status change
applicationSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.updatedDate = Date.now();
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
