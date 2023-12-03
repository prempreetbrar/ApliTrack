// CONTROLLER NOT USED
/*
It was decided that having Permission and Permission_Ability tables was redundant, since combining the 
Admin flag and PermissionLevel in the User table simplified the backend while maintaining desired functionality. 
We also removed the Developer flag and Dev_Specialization table because a developer/admin's permissions 
and abilities are normally managed in the GitHub repository, NOT in the actual application itself. 
*/

const factory = require("./controllerFactory");
const Permission = require("../models/permissionModel");

exports.createPermission = factory.createOne(Permission.Permission);
exports.createPermissionAbility = factory.createOne(Permission.PermissionAbility);

exports.deletePermission = factory.deleteInstance(Permission.Permission);
exports.deletePermissionAbility = factory.deleteInstance(Permission.PermissionAbility);