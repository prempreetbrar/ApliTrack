// CONTROLLER NOT USED
/*
It was decided that having Permission and Permission_Ability tables was redundant, since combining the 
Admin flag and PermissionLevel in the User table simplified the backend while maintaining desired functionality. 
We also removed the Developer flag and Admin_Responsibility and Dev_Specialization tables because 
a developer/admin's permissions and abilities are normally managed in the GitHub repository, 
NOT in the actual application itself. 
*/

const factory = require("./controllerFactory");
const Admin = require("../models/adminModel");

//exports.createAdmin = factory.createOne(Admin.Admin);
exports.createAdminResp = factory.createOne(Admin.Admin_Responsibility);
exports.createDevSpec = factory.createOne(Admin.Dev_Specialization);
//exports.createAdminHasPerm = factory.createOne(Admin.AdminHasPerm);

//exports.deleteAdmin = factory.deleteInstance(Admin.Admin);
exports.deleteAdminResp = factory.deleteInstance(Admin.Admin_Responsibility);
exports.deleteDevSpec = factory.deleteInstance(Admin.Dev_Specialization);
//exports.deleteAdminHasPerm = factory.deleteInstance(Admin.AdminHasPerm);

//exports.updateAdmin = factory.updateInstance(Admin.Admin);
