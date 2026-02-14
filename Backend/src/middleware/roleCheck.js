// Middleware to check user role
exports.roleCheck = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This resource is only available to ${roles.join(' or ')} users.`,
        currentRole: req.user.role,
        requiredRoles: roles
      });
    }

    next();
  };
};
