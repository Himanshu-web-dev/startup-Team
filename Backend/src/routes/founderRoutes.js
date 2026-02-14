const express = require('express');
const router = express.Router();
const founderController = require('../controllers/founderController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const { validateStartup, validateRole } = require('../middleware/validators');

// All routes require authentication and founder role
router.use(protect, roleCheck('founder'));

// Profile routes
router.get('/profile', founderController.getProfile);
router.put('/profile', founderController.updateProfile);

// Startup routes
router.post('/startup', validateStartup, founderController.createStartup);
router.get('/startup', founderController.getStartup);
router.put('/startup/:id', founderController.updateStartup);

// Role routes
router.post('/roles', validateRole, founderController.createRole);
router.get('/roles', founderController.getRoles);
router.put('/roles/:id', founderController.updateRole);
router.delete('/roles/:id', founderController.deleteRole);

// Application management routes
router.get('/applications', founderController.getApplications);
router.put('/applications/:id/accept', founderController.acceptApplication);
router.put('/applications/:id/reject', founderController.rejectApplication);

// Dashboard route
router.get('/dashboard', founderController.getDashboard);

module.exports = router;
