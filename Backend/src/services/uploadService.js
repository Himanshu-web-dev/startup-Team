const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Upload user avatar
exports.uploadAvatar = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'startupteam/avatars',
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'auto' }
        ],
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(new Error('Failed to upload avatar'));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

// Upload startup logo
exports.uploadStartupLogo = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'startupteam/logos',
        transformation: [
          { width: 300, height: 300, crop: 'fill' },
          { quality: 'auto', fetch_format: 'auto' }
        ],
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(new Error('Failed to upload logo'));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

// Delete image from Cloudinary
exports.deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image');
  }
};

// Extract public ID from Cloudinary URL
exports.getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const fileWithExt = parts[parts.length - 1];
  return fileWithExt.split('.')[0];
};
