const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();
router.post("/signup", authController.signUpUser);
router.post("/login", authController.loginUser);
router.patch(
  "/change-password",
  authController.checkIfLoggedIn,
  authController.changePassword
);
router.patch(
  "/reset-password",
  authController.restrictTo(
    authController.GET_AND_DELETE_AND_CREATE_AND_UPDATE
  ),
  authController.resetPassword
);

module.exports = router;
