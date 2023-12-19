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
  authController.checkIfLoggedIn,
  authController.restrictTo(
    authController.GET_AND_DELETE_AND_CREATE_AND_UPDATE
  ),
  authController.resetPassword
);

router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password/:Token", authController.emailResetPassword);

module.exports = router;
