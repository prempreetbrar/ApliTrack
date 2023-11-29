const express = require("express");
const applicantController = require("../controllers/applicantController");
const authController = require("../controllers/authController");

const router = express.Router();
router.post(
  "/get-started",
  authController.checkIfLoggedIn,
  applicantController.createApplicant
);

router.get(
  "/profile",
  authController.checkIfLoggedIn,
  applicantController.addFilter,
  applicantController.getApplicant
);

router.put(
  "/education",
  authController.checkIfLoggedIn,
  applicantController.updateEducation
);

router
  .route("/certifications")
  .post(authController.checkIfLoggedIn, applicantController.createCertification)
  .delete(applicantController.deleteCertification);

router
  .route("/skills")
  .post(authController.checkIfLoggedIn, applicantController.createSkill)
  .delete(applicantController.deleteSkill);

router
  .route("/competitions")
  .post(authController.checkIfLoggedIn, applicantController.createCompetition)
  .delete(applicantController.deleteCompetition);

module.exports = router;
