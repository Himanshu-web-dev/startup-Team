const crypto = require('crypto');

// Generate random token for password reset
exports.generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Hash reset token for storage
exports.hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
