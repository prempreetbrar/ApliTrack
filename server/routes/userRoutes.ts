const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();
// router.use(authController.checkIfLoggedIn);

router.patch(
  "",
  authController.checkIfLoggedIn,
  userController.addFilterUser,
  userController.preventPasswordOrAdminChange,
  userController.updateUser
);

router
  .route("/details")
  .post(
    authController.checkIfLoggedInAdmin,
    authController.restrictTo(authController.GET_AND_DELETE_AND_CREATE),
    userController.createUser
  )
  .get(
    authController.checkIfLoggedInAdmin,
    authController.restrictTo(authController.GET),
    userController.addSearchUsernameName,
    userController.addSortUser,
    userController.getAllUsers
  )
  .delete(
    authController.checkIfLoggedInAdmin,
    authController.restrictTo(authController.GET_AND_DELETE),
    userController.deleteUser
  )
  .patch(
    authController.checkIfLoggedInAdmin,
    authController.restrictTo(
      authController.GET_AND_DELETE_AND_CREATE_AND_UPDATE
    ),
    userController.updateUser
  );

module.exports = router;
