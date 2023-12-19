import { Op } from "sequelize";

const jwt = require("jsonwebtoken");
const util = require("util");
const crypto = require("crypto");

const { User } = require("../models/userModel");
const errorHandling = require("../utils/errorHandling");
const { Applicant } = require("../models/applicantModel");
const Email = require("../utils/email");

/*
  We sign the token according to the user's username. Since
  username is unique, this ensures that no two people have the same token.
  Therefore, when we receive a token, we can easily check if it is valid
  (by checking if it matches a username in our database when we decrypt it).
*/
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

/*
  This function creates the JWT token that allows us
  to authenticate a user.
*/
function createSendToken(user, statusCode, request, response) {
  const token = signToken(user.Username);

  // we don't want the user to be logged in forever, so we set an expiry date
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
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
  const newApplicant = await Applicant.create({
    Username: request.body.Username,
  });

  await new Email(
    newUser,
    "http://localhost:3001/applicants/applicant/profile"
  ).sendWelcome();
  createSendToken(newUser, 201, request, response);
});

exports.loginUser = errorHandling.catchAsync(async (request, response) => {
  if (!request.body.Username || !request.body.Password) {
    throw new errorHandling.AppError(
      "Please provide both a username and password!",
      400
    );
  }

  /*
    In our user model, we excluded password from being included in a query. However,
    this is an exception where we need the user's password (to compare it for login).
    Therefore, we explicitly include it. Sequelize will follow our "rules" specified
    in a query OVER those defined in the model.
  */
  const user = await User.findByPk(request.body.Username, {
    attributes: { include: ["Password"] },
  });

  if (
    !user ||
    !(await user.isPasswordCorrect(request.body.Password, user.Password))
  ) {
    throw new errorHandling.AppError("Incorrect username or password", 401);
  }

  if (!user.IsActive) {
    throw new errorHandling.AppError(
      "Your account has been deactivated. Please contact an administrator to reactivate.",
      401
    );
  }

  createSendToken(user, 200, request, response);
});

exports.checkIfLoggedIn = errorHandling.catchAsync(
  async (request, response, next) => {
    // 1) check if the JWT token was sent with the request
    let token;
    if (
      request.headers.authorization &&
      request.headers.authorization.startsWith("Bearer") &&
      request.headers.authorization.split(" ")[1] !== null
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

    /*
       2) check if the JWT token is valid. We use promisify because
       it allows us to use await (rather than have a messy try catch block).
    */
    const decodedPayload = await util.promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    /*
      3) check if user has been deleted or is inactive. If so, they shouldn't be
      able to interact with our database.
    */
    const user = await User.findByPk(decodedPayload.id);
    if (!user || !user.IsActive) {
      throw new errorHandling.AppError(
        "The user belonging to this token no longer exists or has deactivated their account",
        401
      );
    }

    if (user.hasPasswordChanged(decodedPayload.iat)) {
      throw new errorHandling.AppError(
        "You've recently changed your password; please login again!",
        401
      );
    }
    /*
        Add the user onto the request object. This allows anything afterwards in the middleware
        stack to access the user (by doing request.body.user). For example, if you need to create
        an application for a user, you could do router.post("/application", checkIfLoggedIn, createApplication),
        which would allow your createApplication function (which comes after checkIfLoggedIn in the middleware
        stack) to access the user (and the user's attributes).
    */

    request.body.user = user;
    if (!request.body.Username) {
      request.body.Username = user.Username;
    }
    if (!request.body.ApplicantUsername) {
      request.body.ApplicantUsername = user.Username;
    }
    if (!request.body.ADMINUsername) {
      request.body.ADMINUsername = user.Username;
    }
    if (!request.body.APPLICANTUsername) {
      request.body.APPLICANTUsername = user.Username;
    }

    next();
  }
);

exports.checkIfLoggedInAdmin = errorHandling.catchAsync(
  async (request, response, next) => {
    // 1) check if the JWT token was sent with the request
    let token;
    if (
      request.headers.authorization &&
      request.headers.authorization.startsWith("Bearer") &&
      request.headers.authorization.split(" ")[1] !== null
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

    /*
       2) check if the JWT token is valid. We use promisify because
       it allows us to use await (rather than have a messy try catch block).
    */
    const decodedPayload = await util.promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    /*
      3) check if user has been deleted or is inactive. If so, they shouldn't be
      able to interact with our database.
    */
    const user = await User.findByPk(decodedPayload.id);
    if (!user || !user.IsActive)
      throw new errorHandling.AppError(
        "The user belonging to this token no longer exists or has deactivated their account",
        401
      );

    /*
        Add the user onto the request object. This allows anything afterwards in the middleware
        stack to access the user (by doing request.body.user). For example, if you need to create
        an application for a user, you could do router.post("/application", checkIfLoggedIn, createApplication),
        which would allow your createApplication function (which comes after checkIfLoggedIn in the middleware
        stack) to access the user (and the user's attributes).
    */

    request.body.user = user;
    next();
  }
);

/*
  What we can do is add a list of permissionLevels as a middleware function for a given route. Then,
  before you "next()" and move to that route, we check if the user belongs to one of those permissionLevels.
  If they don't, then they don't get access to that function.
*/
exports.GET = 0;
exports.GET_AND_DELETE = 1;
exports.GET_AND_DELETE_AND_CREATE = 2;
exports.GET_AND_DELETE_AND_CREATE_AND_UPDATE = 3;
exports.restrictTo = (permissionLevel) => {
  return (request, response, next) => {
    console.log(request.body.user);
    if (
      request.body.user.dataValues.PermissionLevel < permissionLevel ||
      !request.body.user.dataValues.AdminFlag
    )
      throw new errorHandling.AppError(
        "You do not have permission to perform this action.",
        403
      );

    next();
  };
};

/*
  This function allows the user to change their password assuming they know their
  existing one.
*/
exports.changePassword = errorHandling.catchAsync(
  async (request, response, next) => {
    /*
       1) we want user to still write their password (so that somebody
       can't just find an open computer and change the password)
      */
    const userWithPassword = await User.findByPk(request.body.Username, {
      attributes: { include: ["Password"] },
    });
    if (
      !(await userWithPassword.isPasswordCorrect(
        request.body.Password,
        userWithPassword.Password
      ))
    ) {
      throw new errorHandling.AppError(
        "The existing password provided was incorrect",
        401
      );
    }

    /*
      Update password. Even though the user didn't send a password confirm
      in their request body, we still need to manually make sure that
      password and password confirm are identical, otherwise the model will
      prevent the update.
    */

    userWithPassword.Password = request.body.NewPassword;
    userWithPassword.PasswordConfirm = request.body.ConfirmNewPassword;
    await userWithPassword.save();

    // 4) Send new JWT token with updated password
    createSendToken(userWithPassword, 200, request, response);
  }
);

exports.resetPassword = errorHandling.catchAsync(
  async (request, response, next) => {
    /*
       1) we want user to still write their password (so that somebody
       can't just find an open computer and change the password)
      */
    const user = await User.findByPk(request.body.Username);

    /*
      Update password. Even though the user didn't send a password confirm
      in their request body, we still need to manually make sure that
      password and password confirm are identical, otherwise the model will
      prevent the update.
    */

    const generatedPassword = generatePassword();
    user.Password = generatedPassword;
    user.PasswordConfirm = generatedPassword;

    try {
      await new Email(
        user,
        "http://localhost:3001/auth/login",
        generatedPassword
      ).sendPasswordEmail();

      await user.save();

      response.status(200).json({
        status: "success",
        message: "New password sent to email!",
      });
    } catch (error) {
      throw new errorHandling.AppError(
        "There was an error resetting the password.",
        500
      );
    }
  }
);

function generatePassword() {
  var length = 16,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

exports.forgotPassword = errorHandling.catchAsync(
  async (request, response, next) => {
    // get user using email, generate reset token, send email containing token
    const user = await User.findByPk(request.body.Username);

    if (!user)
      throw new errorHandling.AppError(
        "There is no user with that email address.",
        404
      );

    const resetToken = user.createPasswordResetToken();
    const resetURL = `http://localhost:3001/auth/reset-password/${request.body.Username}/${resetToken}`;

    // ensure we save the new reset token to the DB
    await user.save();

    try {
      await new Email(user, resetURL).sendPasswordReset();

      response.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (error) {
      user.PasswordResetToken = undefined;
      user.PasswordResetExpires = undefined;

      await user.save();
      throw new errorHandling.AppError(
        "There was an error sending the email. Try again later!",
        500
      );
    }
  }
);

exports.emailResetPassword = errorHandling.catchAsync(
  async (request, response, next) => {
    // 1) get token
    const resetToken = request.params.Token;
    const encryptedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 2) get user
    const user = await User.findOne({
      where: {
        PasswordResetToken: encryptedResetToken,
        PasswordResetExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user)
      throw new errorHandling.AppError(
        "The password reset token is either invalid, or has expired.",
        400
      );

    // 3) update user
    user.Password = request.body.Password;
    user.PasswordConfirm = request.body.PasswordConfirm;
    user.PasswordResetToken = null;
    user.PasswordResetExpires = null;
    await user.save();

    // 4) log user in
    createSendToken(user, 200, request, response);
  }
);
