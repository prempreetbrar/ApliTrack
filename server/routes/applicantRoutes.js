const express = require("express");
const applicantController = require("../controllers/applicantController");
const authController = require("../controllers/authController");

const router = express.Router();
router.post(
  "/get-started",
  //authController.checkIfLoggedIn, //TODO: check later
  applicantController.createApplicant
);

module.exports = router;
