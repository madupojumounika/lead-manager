export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || undefined;

  // Handle Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid ID format for ${err.path}`;
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const duplicatedField = Object.keys(err.keyPattern || {})[0] || 'field';
    message = `A record with this ${duplicatedField} already exists`;
    errors = [{ field: duplicatedField, message }];
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const fieldErrors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message
    }));
    message = fieldErrors[0]?.message || 'Validation error';
    errors = fieldErrors;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {})
  });
};
