// backend/utils/validation.js
const { validationResult } = require("express-validator");

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => error.msg);

    const err = new Error("Bad request.");
    err.errors = {
      details: errors,
    };
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  } else {
    next();
  }
};

module.exports = {
  handleValidationErrors,
};
