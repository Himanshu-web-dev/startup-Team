const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const { validateApplication } = require('../middleware/validators');

// All routes require authentication and member role
router.use(protect, roleCheck('member'));

// Profile routes
router.get('/profile', memberController.getProfile);
router.put('/profile', memberController.updateProfile);

// Startup exploration routes
router.get('/startups', memberController.exploreStartups);
router.get('/startups/saved', memberController.getSavedStartups);
router.get('/startups/:id', memberController.getStartupDetails);
router.post('/startups/:id/save', memberController.saveStartup);
router.delete('/startups/:id/save', memberController.unsaveStartup);

// Application routes
router.post('/applications', validateApplication, memberController.applyToRole);
router.get('/applications', memberController.getMyApplications);
router.delete('/applications/:id', memberController.cancelApplication);

// Dashboard route
router.get('/dashboard', memberController.getDashboard);

module.exports = router;
