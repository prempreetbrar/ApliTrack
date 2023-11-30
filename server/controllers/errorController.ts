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
