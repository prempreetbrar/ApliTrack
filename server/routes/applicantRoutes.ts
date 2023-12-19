const express = require("express");
const applicantController = require("../controllers/applicantController");
const contactController = require("../controllers/contactController");
const authController = require("../controllers/authController");

const router = express.Router();
const offerRouter = require("./offerRoutes");
const interviewRouter = require("./interviewRoutes");
const referralRouter = require("./referralRoutes");
const documentRouter = require("./documentRoutes");

router.post("/get-started", applicantController.createApplicant);
router.use("/offers", offerRouter);
router.use("/interviews", interviewRouter);
router.use("/referrals", referralRouter);
router.use("/documents", documentRouter);

router.use(authController.checkIfLoggedIn);

router.delete("/delete-applicant", applicantController.deleteApplicant);
router.get(
  "/profile",
  applicantController.addFilterUsername,
  applicantController.getApplicant
);

router.patch("/education", applicantController.updateEducation);

router
  .route("/experiences")
  .post(applicantController.createExperience)
  .delete(applicantController.deleteExperience);
router.patch("/experiences/:Experience", applicantController.updateExperience);

router
  .route("/projects")
  .post(applicantController.createProject)
  .delete(applicantController.deleteProject);
router.patch("/projects/:Project", applicantController.updateProject);

router
  .route("/certifications")
  .post(applicantController.createCertification)
  .delete(applicantController.deleteCertification);

router
  .route("/skills")
  .post(applicantController.createSkill)
  .delete(applicantController.deleteSkill);

router
  .route("/competitions")
  .post(applicantController.createCompetition)
  .delete(applicantController.deleteCompetition);

router
  .route("/known-contacts")
  .get(
    applicantController.addFilterUsername,
    contactController.addFilterContactID,
    contactController.addSearchNameContactDate,
    applicantController.getApplicantKnowsContact
  )
  .post(applicantController.createApplicantKnowsContact)
  .delete(applicantController.deleteApplicantKnowsContact)
  .patch(applicantController.updateApplicantKnowsContact);

router
  .route("/tracks-job")
  .get(
    applicantController.addFilterUsername,
    applicantController.addSearchDateToApply,
    applicantController.getApplicantTracksJob
  )
  .post(applicantController.createApplicantTracksJob)
  .delete(applicantController.deleteApplicantTracksJob)
  .patch(applicantController.updateApplicantTracksJob);

module.exports = router;
