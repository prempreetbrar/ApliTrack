const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();
router.put("", authController.checkIfLoggedIn, userController.updateUser);

module.exports = router;
