"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const util = require("util");
const User = require("../models/userModel");
const errorHandling = require("../utils/errorHandling");
const { Applicant } = require("../models/applicantModel");
/*
  We sign the token according to the user's username. Since
  username is unique, this ensures that no two people have the same token.
  Therefore, when we receive a token, we can easily check if it is valid
  (by checking if it matches a username in our database when we decrypt it).
*/
function signToken(username) {
    return jwt.sign({
        id: username,
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}
/*
  This function creates the JWT token that allows us
  to authenticate a user.
*/
function createSendToken(user, statusCode, request, response) {
    const token = signToken(user.Username);
    // we don't want the user to be logged in forever, so we set an expiry date
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
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
exports.signUpUser = errorHandling.catchAsync((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield User.create({
        Username: request.body.Username,
        Password: request.body.Password,
        PasswordConfirm: request.body.PasswordConfirm,
        Fname: request.body.Fname || "",
        Lname: request.body.Lname || "",
    });
    const newApplicant = yield Applicant.create({
        Username: request.body.Username,
    });
    createSendToken(newUser, 201, request, response);
}));
exports.loginUser = errorHandling.catchAsync((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    if (!request.body.Username || !request.body.Password) {
        throw new errorHandling.AppError("Please provide both a username and password!", 400);
    }
    /*
      In our user model, we excluded password from being included in a query. However,
      this is an exception where we need the user's password (to compare it for login).
      Therefore, we explicitly include it. Sequelize will follow our "rules" specified
      in a query OVER those defined in the model.
    */
    const user = yield User.findByPk(request.body.Username, {
        attributes: { include: ["Password"] },
    });
    if (!user ||
        !(yield user.isPasswordCorrect(request.body.Password, user.Password))) {
        throw new errorHandling.AppError("Incorrect username or password", 401);
    }
    createSendToken(user, 200, request, response);
}));
exports.checkIfLoggedIn = errorHandling.catchAsync((request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) check if the JWT token was sent with the request
    let token;
    if (request.headers.authorization &&
        request.headers.authorization.startsWith("Bearer") &&
        request.headers.authorization.split(" ")[1] !== null) {
        token = request.headers.authorization.split(" ")[1];
    }
    else if (request.cookies.jwt) {
        token = request.cookies.jwt;
    }
    if (!token)
        throw new errorHandling.AppError("You are not logged in. Please log in to get access.", 401);
    /*
       2) check if the JWT token is valid. We use promisify because
       it allows us to use await (rather than have a messy try catch block).
    */
    const decodedPayload = yield util.promisify(jwt.verify)(token, process.env.JWT_SECRET);
    /*
      3) check if user has been deleted or is inactive. If so, they shouldn't be
      able to interact with our database.
    */
    const user = yield User.findByPk(decodedPayload.id);
    if (!user || !user.IsActive)
        throw new errorHandling.AppError("The user belonging to this token no longer exists or has deactivated their account", 401);
    /*
        Add the user onto the request object. This allows anything afterwards in the middleware
        stack to access the user (by doing request.body.user). For example, if you need to create
        an application for a user, you could do router.post("/application", checkIfLoggedIn, createApplication),
        which would allow your createApplication function (which comes after checkIfLoggedIn in the middleware
        stack) to access the user (and the user's attributes).
    */
    request.body.user = user;
    request.body.Username = user.Username;
    request.body.ApplicantUsername = user.Username;
    next();
}));
/*
  This function allows the user to change their password assuming they know their
  existing one.
*/
exports.changePassword = errorHandling.catchAsync((request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    /*
       1) we want user to still write their password (so that somebody
       can't just find an open computer and change the password)
      */
    const userWithPassword = yield User.findByPk(request.body.Username, {
        attributes: { include: ["Password"] },
    });
    if (!(yield userWithPassword.isPasswordCorrect(request.body.Password, userWithPassword.Password))) {
        throw new errorHandling.AppError("The existing password provided was incorrect", 401);
    }
    /*
      Update password. Even though the user didn't send a password confirm
      in their request body, we still need to manually make sure that
      password and password confirm are identical, otherwise the model will
      prevent the update.
    */
    userWithPassword.Password = request.body.NewPassword;
    userWithPassword.PasswordConfirm = request.body.ConfirmNewPassword;
    yield userWithPassword.save();
    // 4) Send new JWT token with updated password
    createSendToken(userWithPassword, 200, request, response);
}));
