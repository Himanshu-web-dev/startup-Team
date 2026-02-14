const mongoose = require('mongoose');

const savedStartupSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Startup',
    required: true
  },
  savedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate saves
savedStartupSchema.index({ userId: 1, startupId: 1 }, { unique: true });
savedStartupSchema.index({ savedDate: -1 });

module.exports = mongoose.model('SavedStartup', savedStartupSchema);
