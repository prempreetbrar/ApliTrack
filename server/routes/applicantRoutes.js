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
  .route("/experiences")
  .post(authController.checkIfLoggedIn, applicantController.createExperience)
  .delete(authController.checkIfLoggedIn, applicantController.deleteExperience);
// .put(authController.checkIfLoggedIn, authController.updateExperience);

router
  .route("/certifications")
  .post(authController.checkIfLoggedIn, applicantController.createCertification)
  .delete(
    authController.checkIfLoggedIn,
    applicantController.deleteCertification
  );

router
  .route("/skills")
  .post(authController.checkIfLoggedIn, applicantController.createSkill)
  .delete(authController.checkIfLoggedIn, applicantController.deleteSkill);

router
  .route("/competitions")
  .post(authController.checkIfLoggedIn, applicantController.createCompetition)
  .delete(
    authController.checkIfLoggedIn,
    applicantController.deleteCompetition
  );

module.exports = router;
