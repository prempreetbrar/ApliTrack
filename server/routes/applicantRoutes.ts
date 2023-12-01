const express = require("express");
const applicantController = require("../controllers/applicantController");
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

module.exports = router;
