const validator = require('validator');

// Validate email
exports.validateEmail = (email) => {
  if (!validator.isEmail(email)) {
    throw new Error('Please provide a valid email');
  }
  return true;
};

// Validate phone
exports.validatePhone = (phone) => {
  if (!validator.isMobilePhone(phone)) {
    throw new Error('Please provide a valid phone number');
  }
  return true;
};

// Validate URL
exports.validateURL = (url) => {
  if (!validator.isURL(url)) {
    throw new Error('Please provide a valid URL');
  }
  return true;
};

// Sanitize input
exports.sanitize = (input) => {
  return validator.escape(input.trim());
};

// Validation middleware
exports.validate = (validations) => {
  return async (req, res, next) => {
    try {
      for (const field in validations) {
        const value = req.body[field];
        const rules = validations[field];

        if (rules.required && !value) {
          return res.status(400).json({
            success: false,
            message: `${field} is required`
          });
        }

        if (value) {
          if (rules.type === 'email' && !validator.isEmail(value)) {
            return res.status(400).json({
              success: false,
              message: `Please provide a valid ${field}`
            });
          }

          if (rules.type === 'url' && !validator.isURL(value)) {
            return res.status(400).json({
              success: false,
              message: `Please provide a valid ${field}`
            });
          }

          if (rules.minLength && value.length < rules.minLength) {
            return res.status(400).json({
              success: false,
              message: `${field} must be at least ${rules.minLength} characters`
            });
          }

          if (rules.maxLength && value.length > rules.maxLength) {
            return res.status(400).json({
              success: false,
              message: `${field} must not exceed ${rules.maxLength} characters`
            });
          }
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
