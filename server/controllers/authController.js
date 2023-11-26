const jwt = require("jsonwebtoken");
const util = require("util");

const User = require("../models/userModel");
const errorHandling = require("../utils/errorHandling");

function signToken(username) {
  return jwt.sign(
    {
      id: username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
}

function createSendToken(user, statusCode, request, response) {
  const token = signToken(user.Username);
  // we don't want the user to be logged in forever.
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: true,
    httpOnly: true,
  };
  response.cookie("jwt", token, cookieOptions);
  /*
    we're gonna send the userObject back to the user who logged in (just
    a convention when doing authenticiation). We don't want the password
    to be sent back in transit (ie. in case there is a MITM attack).
    Therefore, set it to null. This won't affect the database because
    we didn't do user.save(). 

    In other words, we have a user "object" (separate from the actual
    row in the db). We are clearing the password on this "object."
  */
  user.Password = undefined;

  response.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
}

exports.signUpUser = errorHandling.catchAsync(async (request, response) => {
  const newUser = await User.create({
    Username: request.body.Username,
    Password: request.body.Password,
    PasswordConfirm: request.body.PasswordConfirm,
    Fname: request.body.Fname || "",
    Lname: request.body.Lname || "",
  });

  createSendToken(newUser, 201, request, response);
});

exports.loginUser = errorHandling.catchAsync(async (request, response) => {
  if (!request.body.Username || !request.body.Password) {
    throw new errorHandling.AppError(
      "Please provide both a username and password!",
      400
    );
  }

  const user = await User.findByPk(request.body.Username, {
    attributes: { include: ["Password"] },
  });
  if (
    !user ||
    !(await user.isPasswordCorrect(request.body.Password, user.Password))
  ) {
    throw new errorHandling.AppError("Incorrect username or password", 401);
  }

  createSendToken(user, 200, request, response);
});

exports.checkIfLoggedIn = errorHandling.catchAsync(
  async (request, response) => {
    // 1) check if the JWT token exists
    let token;
    if (
      request.headers.authorization &&
      request.headers.authorization.startsWith("Bearer")
    ) {
      token = request.headers.authorization.split(" ")[1];
    } else if (request.cookies.jwt) {
      token = request.cookies.jwt;
    }

    if (!token)
      throw new errorHandling.AppError(
        "You are not logged in. Please log in to get access.",
        401
      );

    // 2) is valid
    const decodedPayload = await util.promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    // 3) check if user has been deleted in the meantime or is inactive
    const user = await User.findByPk(decodedPayload.id);
    if (!user || !user.IsActive)
      throw new errorHandling.AppError(
        "The user belonging to this token no longer exists or has deactivated their account",
        401
      );

    // 5) Grant access to protected route
    request.user = user;
    next();
  }
);
