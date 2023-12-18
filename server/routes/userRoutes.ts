const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();
router.patch(
  "",
  authController.checkIfLoggedIn,
  userController.addFilter,
  userController.preventPasswordOrAdminChange,
  userController.updateUser
);

router
  .route("/details")
  .post(userController.createUser)
  .get(userController.getAllUsers)
  .patch(userController.updateUser);

module.exports = router;
