const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();
router.use(authController.checkIfLoggedIn);

router.patch(
  "",
  userController.addFilter,
  userController.preventPasswordOrAdminChange,
  userController.updateUser
);

router
  .route("/details")
  .post(authController.restrictTo(authController.GET_AND_DELETE_AND_CREATE), userController.createUser)
  .get(authController.restrictTo(authController.GET), userController.addSearchFilter, userController.getAllUsers)
  .delete(authController.restrictTo(authController.GET_AND_DELETE), userController.deleteUser)
  .patch(authController.restrictTo(authController.GET_AND_DELETE_AND_CREATE_AND_UPDATE), userController.updateUser);

module.exports = router;
