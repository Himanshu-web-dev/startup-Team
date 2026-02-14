const jwt = require('jsonwebtoken');

// Generate Access Token (short-lived)
exports.generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '15m' }
  );
};

// Generate Refresh Token (long-lived)
exports.generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
};

// Verify Refresh Token
exports.verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// Generate both tokens
exports.generateTokenPair = (userId) => {
  return {
    accessToken: this.generateAccessToken(userId),
    refreshToken: this.generateRefreshToken(userId)
  };
};
