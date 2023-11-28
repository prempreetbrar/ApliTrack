const express = require("express");
const applicantController = require("../controllers/applicantController");
const authController = require("../controllers/authController");

const router = express.Router();
router.post(
  "/get-started",
  authController.checkIfLoggedIn,
  applicantController.createApplicant
);

router.post(
  "/certifications",
  authController.checkIfLoggedIn,
  applicantController.createCertification
);

module.exports = router;
