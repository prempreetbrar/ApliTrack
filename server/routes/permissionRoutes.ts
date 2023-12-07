// ROUTES NOT USED
/*
It was decided that having Permission and Permission_Ability tables was redundant, since combining the 
Admin flag and PermissionLevel in the User table simplified the backend while maintaining desired functionality. 
We also removed the Developer flag and Dev_Specialization table because a developer/admin's permissions 
and abilities are normally managed in the GitHub repository, NOT in the actual application itself. 
*/

const express = require("express");
const permissionController = require("../controllers/permissionController");

const router = express.Router();

router.route("/details")
.post(permissionController.createPermission)
.delete(permissionController.deletePermission);

router.route("/abilities")
.post(permissionController.createPermissionAbility)
.delete(permissionController.deletePermissionAbility);

module.exports = router;