const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'others';
    
    if (file.fieldname === 'resume') {
      folder = 'resumes';
    } else if (file.fieldname === 'image' || file.fieldname === 'avatar') {
      folder = 'images';
    } else if (file.fieldname === 'document') {
      folder = 'documents';
    }
    
    const destPath = path.join(uploadDir, folder);
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    
    cb(null, destPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = {
    resume: /pdf|doc|docx/,
    image: /jpeg|jpg|png|gif|webp/,
    document: /pdf|doc|docx|txt/
  };

  const fieldType = file.fieldname === 'resume' ? 'resume' 
                  : file.fieldname === 'image' || file.fieldname === 'avatar' ? 'image'
                  : 'document';

  const extname = allowedTypes[fieldType].test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes[fieldType].test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only ${fieldType} files are allowed.`));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: fileFilter
});

// Export different upload configurations
exports.uploadResume = upload.single('resume');
exports.uploadImage = upload.single('image');
exports.uploadAvatar = upload.single('avatar');
exports.uploadMultipleImages = upload.array('images', 10);
exports.uploadDocument = upload.single('document');

// Error handling middleware
exports.handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size is too large. Maximum size is 5MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};
