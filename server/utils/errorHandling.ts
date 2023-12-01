/*
  This class is to create a more verbose/informative error; it is a "quality-of-life"
  class. Even without it, the program would function.
*/
exports.AppError = class AppError extends Error {
  statusCode: any;
  status: string;

  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    Error.captureStackTrace(this, this.constructor);
  }
};

/*
  What's this doing? It's taking a function (usually a controller that's
  handling a request) and wrapping it. If the controller throws an error,
  then the .catch(next) will be invoked, passing the error into the "next"
  ERROR-HANDLING middleware in the stack (not the next "regular" middleware). 

  This prevents us from needing to put try-catch blocks everywhere in our code;
  we have this generic wrapper that "try-catches" all of our controllers for us.
*/
exports.catchAsync = (asyncFunc) => {
  return function wrapper(request, response, next) {
    asyncFunc(request, response, next).catch(next);
  };
};

/*
  This handleUncaught function gracefully closes the process when dealing with
  uncaught exceptions or rejections. While it may not make a difference here 
  (on such a small scale application), this is best practice (so we are still 
  implementing it).
*/
exports.handleUncaught = (event, server) => {
  process.on(event, (error) => {
    //@ts-ignore
    console.error(error.name, error.message);
    if (server) server.close(() => process.exit(1));
    else process.exit(1);
  });
};
