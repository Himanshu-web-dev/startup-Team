const User = require('../models/User');
const Startup = require('../models/Startup');
const uploadService = require('../services/uploadService');

// @route   POST /api/upload/avatar
// @desc    Upload user avatar
// @access  Private
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    // Upload to Cloudinary
    const result = await uploadService.uploadAvatar(req.file);

    // Update user avatar
    const user = await User.findById(req.user._id);
    
    // Delete old avatar if exists
    if (user.avatar) {
      const oldPublicId = uploadService.getPublicIdFromUrl(user.avatar);
      if (oldPublicId) {
        await uploadService.deleteImage(oldPublicId).catch(err => 
          console.error('Failed to delete old avatar:', err)
        );
      }
    }

    user.avatar = result.url;
    await user.save();

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        url: result.url
      }
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar',
      error: error.message
    });
  }
};

// @route   POST /api/upload/startup-logo
// @desc    Upload startup logo
// @access  Private (Founder only)
exports.uploadStartupLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    // Upload to Cloudinary
    const result = await uploadService.uploadStartupLogo(req.file);

    // Update startup logo
    const startup = await Startup.findOne({ founderId: req.user._id });
    
    if (!startup) {
      return res.status(404).json({
        success: false,
        message: 'Startup not found. Please create a startup first.'
      });
    }

    // Delete old logo if exists
    if (startup.logo) {
      const oldPublicId = uploadService.getPublicIdFromUrl(startup.logo);
      if (oldPublicId) {
        await uploadService.deleteImage(oldPublicId).catch(err => 
          console.error('Failed to delete old logo:', err)
        );
      }
    }

    startup.logo = result.url;
    await startup.save();

    res.json({
      success: true,
      message: 'Logo uploaded successfully',
      data: {
        url: result.url
      }
    });
  } catch (error) {
    console.error('Upload logo error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload logo',
      error: error.message
    });
  }
};
