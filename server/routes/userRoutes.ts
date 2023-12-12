const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();
router.patch(
  "",
  authController.checkIfLoggedIn,
  userController.preventPasswordOrAdminChange,
  userController.updateUser
);

module.exports = router;
