const express = require("express");
const applicantController = require("../controllers/applicantController");
const contactController = require("../controllers/contactController");
const authController = require("../controllers/authController");

const router = express.Router();
const interviewRouter = require("./interviewRoutes");

router.post("/get-started", applicantController.createApplicant);

router.use(authController.checkIfLoggedIn);

router.delete("/delete-applicant", applicantController.deleteApplicant);
router.get(
  "/profile",
  applicantController.addFilter,
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
  .post(applicantController.createProject, applicantController.deleteProject);
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

router.use("/interviews", interviewRouter);

router
  .route("/known-contacts")
  .get(
    applicantController.addFilter,
    contactController.addFilter,
    applicantController.getApplicantKnowsContact
  )
  .post(applicantController.createApplicantKnowsContact)
  .delete(applicantController.deleteApplicantKnowsContact)
  .patch(applicantController.updateApplicantKnowsContact);

router
  .route("/tracks-job")
  .get(applicantController.addFilter, applicantController.getApplicantTracksJob)
  .post(applicantController.createApplicantTracksJob)
  .delete(applicantController.deleteApplicantTracksJob)
  .patch(applicantController.updateApplicantTracksJob);

module.exports = router;
