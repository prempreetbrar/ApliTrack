// ROUTES NOT USED
/*
It was decided that having Permission and Permission_Ability tables was redundant, since combining the 
Admin flag and PermissionLevel in the User table simplified the backend while maintaining desired functionality. 
We also removed the Developer flag and Admin_Responsibility and Dev_Specialization tables because 
a developer/admin's permissions and abilities are normally managed in the GitHub repository, 
NOT in the actual application itself. 
*/

const express = require("express");
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");

const router = express.Router();

/*
router.route("/details")
.post(authController.checkIfLoggedIn, adminController.createAdmin)
.delete(authController.checkIfLoggedIn, adminController.deleteAdmin)
.put(authController.checkIfLoggedIn, adminController.updateAdmin);
*/

router.route("/responsibilities")
.post(authController.checkIfLoggedIn, adminController.createAdminResp)
.delete(authController.checkIfLoggedIn, adminController.deleteAdminResp);

router.route("/developer-specializations")
.post(authController.checkIfLoggedIn, adminController.createDevSpec)
.delete(authController.checkIfLoggedIn, adminController.deleteDevSpec);

/*
router.route("/permissions")
.post(authController.checkIfLoggedIn, adminController.createAdminHasPerm)
.delete(authController.checkIfLoggedIn, adminController.deleteAdminHasPerm);
*/

module.exports = router;