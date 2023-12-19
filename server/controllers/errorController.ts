const jwt = require("jsonwebtoken");
const { Sequelize } = require("sequelize");
const errorHandling = require("../utils/errorHandling");

/*
  This is our error-handling middleware. Notice that other middleware
  in other files (like controller files) only take request and response (or
  request, response, next). 

  This middleware is special because it has 4 arguments (the error is the first one).
  This is how Express knows to "jump" to this middleware function in our middleware 
  "pile" or "stack" whenever it encounters an error.

  Again, we are simply producing a more detailed status message to make our errorHandling easier.
*/
module.exports = (error, request, response, next) => {
  let detailedError = { ...error };
  detailedError.message = error.message;
  detailedError.stack = error.stack;
  detailedError.statusCode = error.statusCode || 500;
  detailedError.status = error.status || "error";

  if (error instanceof Sequelize.UniqueConstraintError)
    detailedError = handleDBDuplicateError(detailedError);
  else if (error instanceof Sequelize.ValidationError) {
    detailedError = handleDBValidationError(detailedError);
  } else if (error instanceof Sequelize.ForeignKeyConstraintError)
    detailedError = handleDBForeignKeyConstraintError(detailedError);
  else if (error instanceof jwt.TokenExpiredError) {
    detailedError = handleJSONTokenExpiredError();
  } else if (error instanceof jwt.JsonWebTokenError) {
    detailedError = handleJSONWebTokenError();
  }

  sendError(detailedError, request, response);
};

/*
  Allow the error to be sent back to the individual making the request, but
  also print it in the console (so that if you're working on a local development
  environment you can see it).
*/
function sendError(error, request, response) {
  console.error("Error: ", error);

  return response.status(error.statusCode).json({
    error: error,
    status: error.status,
    message: error.message,
    stack: error.stack,
  });
}

function handleDBDuplicateError(error) {
  const errorItem = error.errors.pop();

  //@ts-ignore
  const message = `DUPLICATE FIELD. ${errorItem.message}: ${errorItem.value}. Please use another ${errorItem.path}.`;
  return new errorHandling.AppError(message, 404);
}

function handleDBValidationError(error) {
  const errorItem = error.errors[0];
  let errorValue = "";

  switch (errorItem.path) {
    case "Password":
    case "PasswordConfirm":
      errorValue += ".";
      break;
    default:
      errorValue += `: ${errorItem.value}. Ensure you filled out the relevant fields correctly.`;
  }

  const message = `VALIDATION ERROR. ${errorItem.message}${errorValue}`;
  return new errorHandling.AppError(message, 422);
}

function handleDBForeignKeyConstraintError(error) {
  const errorItem = error.errors[0];

  //@ts-ignore
  const message = `FOREIGN KEY CONSTRAINT ERROR. ${errorItem.message}: ${errorItem.value}. Please ensure that ${errorItem.path} is not empty and refers to an existing ${errorItem.path}.`;
  return new errorHandling.AppError(message, 404);
}

function handleJSONWebTokenError() {
  return new errorHandling.AppError("Invalid token. Please log in again!", 401);
}

function handleJSONTokenExpiredError() {
  return new errorHandling.AppError(
    "Your token has expired. Please log in again!",
    401
  );
}
