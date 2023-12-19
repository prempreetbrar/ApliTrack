const factory = require("./controllerFactory");
const errorHandling = require("../utils/errorHandling");
const { User } = require("../models/userModel");

exports.preventPasswordOrAdminChange = errorHandling.catchAsync(
  async (request, response, next) => {
    if (
      "NewPassword" in request.body ||
      "Password" in request.body ||
      "ConfirmNewPassword" in request.body
    )
      throw new errorHandling.AppError(
        "This route is NOT for password changes. Please use /change-password."
      );

    if ("AdminFlag" in request.body || "PermissionLevel" in request.body) {
      throw new errorHandling.AppError(
        "This route is NOT for permission changes."
      );
    }

    if ("isActive" in request.body) {
      throw new errorHandling.AppError(
        "This route is NOT for deactivating a user."
      );
    }

    const filters = new Set(["Fname", "Lname"]);
    const filteredBody = {};
    for (const key in request.body) {
      if (filters.has(key)) {
        filteredBody[key] = request.body[key];
      }
    }

    request.body = { ...request.body, ...filteredBody };
    next();
  }
);
exports.updateUser = factory.updateInstance(User);
exports.getAllUsers = factory.getAll(User);
exports.createUser = factory.createOne(User);
exports.deleteUser = factory.deleteInstance(User);

exports.addFilterUser = factory.addFilter("Username");
exports.addSortUser = factory.addSort();
exports.addSearchUsernameName = factory.addSearch(
  ["Username", "String"],
  ["Fname", "String"],
  ["Lname", "String"]
);
