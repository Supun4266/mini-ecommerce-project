import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must be at most 50 characters",
  }),

  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Enter a valid email",
  }),

  password: Joi.string()
    .trim()
    .min(12)
    .pattern(/[A-Z]/, "uppercase letter")
    .pattern(/[a-z]/, "lowercase letter")
    .pattern(/[0-9]/, "number")
    .pattern(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "special character")
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 12 characters",
      "string.pattern.name": "Password must contain at least one {#name}",
    }),

  repwd: Joi.string()
    .trim()
    .min(12)
    .pattern(/[A-Z]/, "uppercase letter")
    .pattern(/[a-z]/, "lowercase letter")
    .pattern(/[0-9]/, "number")
    .pattern(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "special character")
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 12 characters",
      "string.pattern.name": "Password must contain at least one {#name}",
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Enter a valid email",
  }),

  password: Joi.string()
    .trim()
    .min(12)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 12 characters",
      "string.pattern.name": "Password must contain at least one {#name}",
    }),
});

export const validateRegisterInput = (req, res, next) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map((err) => ({
        path: err.path[0],
        message: err.message,
      })),
    });
  }
  next();
};


// Middleware for login validation
export const validateLoginInput = (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map((err) => ({
        path: err.path[0],
        message: err.message,
      })),
    });
  }

  next();
};

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};