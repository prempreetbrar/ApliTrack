const express = require("express");

const jobController = require("../controllers/jobController");
const authController = require("../controllers/authController");
const router = express.Router();

router
  .route("")
  .post(
    authController.checkIfLoggedIn,
    jobController.uploadJobPostStorage.single("JobPostFile"),
    jobController.uploadJobPostFile,
    jobController.createJob
  )
  .delete(
    authController.checkIfLoggedIn,
    authController.restrictTo(authController.GET_AND_DELETE),
    jobController.deleteJob
  )
  .patch(
    authController.checkIfLoggedIn,
    jobController.uploadJobPostStorage.single("JobPostFile"),
    jobController.uploadJobPostFile,
    jobController.updateJob
  )
  .get(jobController.getAllJobs);

router
  .route("/:PositionID")
  .get(jobController.addFilterPositionID, jobController.getJob);

router
  .route("/responsibilities")
  .post(jobController.createJobResp)
  .delete(jobController.deleteJobResp);

router
  .route("/qualifications")
  .post(authController.checkIfLoggedIn, jobController.createJobQual)
  .delete(authController.checkIfLoggedIn, jobController.deleteJobQual);

//for many-to-many relationships
router
  .route("/mentions")
  .post(jobController.createJobMentionsInterview)
  .delete(jobController.deleteJobMentionsInterview);

module.exports = router;
