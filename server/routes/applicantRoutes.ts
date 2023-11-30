const express = require("express");
const applicantController = require("../controllers/applicantController");
const authController = require("../controllers/authController");

const router = express.Router();
const interviewRouter = require("./interviewRoutes");

router.post(
  "/get-started",
  authController.checkIfLoggedIn,
  applicantController.createApplicant
);

router.delete("/delete-applicant", applicantController.deleteApplicant);
router.get(
  "/profile",
  authController.checkIfLoggedIn,
  applicantController.addFilter,
  applicantController.getApplicant
);

router.patch(
  "/education",
  authController.checkIfLoggedIn,
  applicantController.updateEducation
);

router
  .route("/experiences")
  .post(authController.checkIfLoggedIn, applicantController.createExperience)
  .delete(authController.checkIfLoggedIn, applicantController.deleteExperience);

router.patch(
  "/experiences/:Experience",
  authController.checkIfLoggedIn,
  applicantController.updateExperience
);

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

router.use("/interviews", interviewRouter);

module.exports = router;
