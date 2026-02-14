const { body, validationResult } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Registration validation
exports.validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\+\-\(\)]+$/).withMessage('Please provide a valid phone number')
    .isLength({ min: 10, max: 15 }).withMessage('Phone number must be between 10 and 15 digits'),
  
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['founder', 'member']).withMessage('Role must be either founder or member'),
  
  validate
];

// Login validation
exports.validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  validate
];

// OTP verification validation
exports.validateVerifyOTP = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('otp')
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  
  validate
];

// Forgot password validation
exports.validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  validate
];

// Reset password validation
exports.validateResetPassword = [
  body('token')
    .notEmpty().withMessage('Reset token is required'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  
  validate
];

// Startup validation
exports.validateStartup = [
  body('name')
    .trim()
    .notEmpty().withMessage('Startup name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Startup name must be between 2 and 100 characters'),
  
  body('industry')
    .notEmpty().withMessage('Industry is required')
    .isIn(['SaaS', 'AI/ML', 'Fintech', 'EdTech', 'HealthTech', 'E-commerce', 'Gaming', 'Blockchain', 'IoT', 'Cybersecurity', 'Marketing', 'Social Media', 'Real Estate', 'Travel', 'Food & Beverage', 'Enterprise', 'Developer Tools', 'Other'])
    .withMessage('Invalid industry'),
  
  body('stage')
    .notEmpty().withMessage('Funding stage is required')
    .isIn(['Idea Phase', 'MVP/Pre-seed', 'Seed', 'Series A+', 'Growth Stage'])
    .withMessage('Invalid funding stage'),
  
  body('teamSize')
    .notEmpty().withMessage('Team size is required')
    .isIn(['1-5', '6-10', '11-20', '21-50', '51-100', '100+'])
    .withMessage('Invalid team size'),
  
  body('website')
    .optional()
    .trim()
    .isURL().withMessage('Please provide a valid website URL'),
  
  body('linkedin')
    .optional()
    .trim()
    .matches(/^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/).withMessage('Please provide a valid LinkedIn URL'),
  
  validate
];

// Role validation
exports.validateRole = [
  body('title')
    .trim()
    .notEmpty().withMessage('Role title is required')
    .isLength({ max: 100 }).withMessage('Role title cannot exceed 100 characters'),
  
  body('experienceLevel')
    .notEmpty().withMessage('Experience level is required')
    .isIn(['Fresher (0-1 Years)', 'Junior (1-2 Years)', 'Mid-Level (3-5 Years)', 'Senior (5+ Years)', 'Lead/Principal (8+ Years)', 'Any'])
    .withMessage('Invalid experience level'),
  
  body('employmentType')
    .notEmpty().withMessage('Employment type is required')
    .isIn(['Full-Time', 'Part-Time', 'Remote', 'Contract', 'Internship'])
    .withMessage('Invalid employment type'),
  
  body('skills')
    .isArray({ min: 1 }).withMessage('At least one skill is required'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Role description is required')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  
  validate
];

// Application validation
exports.validateApplication = [
  body('roleId')
    .notEmpty().withMessage('Role ID is required')
    .isMongoId().withMessage('Invalid role ID'),
  
  body('coverLetter')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Cover letter cannot exceed 1000 characters'),
  
  validate
];
