const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

// Upload avatar (all authenticated users)
router.post('/avatar', protect, upload.single('avatar'), uploadController.uploadAvatar);

// Upload startup logo (founders only)
router.post('/startup-logo', protect, roleCheck('founder'), upload.single('logo'), uploadController.uploadStartupLogo);

module.exports = router;
