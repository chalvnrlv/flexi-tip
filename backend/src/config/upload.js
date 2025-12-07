const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure storage for different file types
const createStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `jastipconnect/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    },
  });
};

// Create different upload instances
const uploadAvatar = multer({
  storage: createStorage('avatars'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const uploadProduct = multer({
  storage: createStorage('products'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const uploadPaymentProof = multer({
  storage: createStorage('payments'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const uploadChatAttachment = multer({
  storage: createStorage('chat'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

module.exports = {
  cloudinary,
  uploadAvatar,
  uploadProduct,
  uploadPaymentProof,
  uploadChatAttachment,
};
