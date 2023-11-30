const factory = require("./controllerFactory");
const Admin = require("../models/adminModel");

exports.createAdmin = factory.createOne(Admin.Admin);
exports.createAdminResp = factory.createOne(Admin.Admin_Responsibility);
exports.createDevSpec = factory.createOne(Admin.Dev_Specialization);

exports.deleteAdmin = factory.deleteInstance(Admin.Admin);
exports.deleteAdminResp = factory.deleteInstance(Admin.Admin_Responsibility);
exports.deleteDevSpec = factory.deleteInstance(Admin.Dev_Specialization);

exports.updateAdmin = factory.updateInstance(Admin.Admin);