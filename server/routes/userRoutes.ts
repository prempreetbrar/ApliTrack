const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();
router.patch(
  "",
  authController.checkIfLoggedIn,
  authController.restrictTo(authController.DELETE_AND_CREATE_AND_UPDATE),
  userController.updateUser
);

module.exports = router;
