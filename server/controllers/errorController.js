const errorHandling = require("../utils/errorHandling");

module.exports = (error, request, response, next) => {
  let detailedError = { ...error };
  detailedError.message = error.message;
  detailedError.stack = error.stack;
  detailedError.statusCode = error.statusCode || 500;
  detailedError.status = error.status || "error";

  sendError(detailedError, request, response);
};

function handleJSONWebTokenError() {
  return new errorHandling.AppError("Invalid token. Please log in again!", 401);
}

function handleJSONTokenExpiredError() {
  return new errorHandling.AppError(
    "Your token has expired. Please log in again!",
    401
  );
}

function sendError(error, request, response) {
  console.error("Error: ", error);

  return response.status(error.statusCode).json({
    error: error,
    status: error.status,
    message: error.message,
    stack: error.stack,
  });
}
