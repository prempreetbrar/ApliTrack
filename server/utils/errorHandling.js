exports.AppError = class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    Error.captureStackTrace(this, this.constructor);
  }
};

exports.catchAsync = (asyncFunc) => {
  return function wrapper(request, response, next) {
    asyncFunc(request, response, next).catch(next);
  };
};

exports.handleUncaught = (event, server) => {
  process.on(event, (error) => {
    console.error(error.name, error.message);
    if (server) server.close(() => process.exit(1));
    else process.exit(1);
  });
};
