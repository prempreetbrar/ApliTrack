const factory = require("./controllerFactory");
const { User } = require("../models/userModel");

exports.updateUser = factory.updateInstance(User);
