const express = require("express");
const multer = require("multer");

const jobController = require("../controllers/jobController");
const authController = require("../controllers/authController");
const controllerFactory = require("../controllers/controllerFactory");

const router = express.Router();
const upload = multer({
  storage: controllerFactory.uploadStorage("./uploads/jobPosts"),
});

router
  .route("")
  .post(
    authController.checkIfLoggedIn,
    upload.single("JobPostFile"),
    jobController.uploadJobPostFile,
    jobController.createJob
  )
  .delete(
    authController.checkIfLoggedIn,
    authController.restrictTo(authController.DELETE_ONLY),
    jobController.deleteJob
  )
  .patch(
    authController.checkIfLoggedIn,
    upload.single("JobPostFile"),
    jobController.uploadJobPostFile,
    jobController.updateJob
  )
  .get(jobController.getAllJobs);

router
  .route("/:PositionID")
  .get(jobController.addFilterID, jobController.getJob);

router
  .route("/responsibilities")
  .post(jobController.createJobResp)
  .delete(jobController.deleteJobResp);

router
  .route("/qualifications")
  .post(authController.checkIfLoggedIn, jobController.createJobQual)
  .delete(authController.checkIfLoggedIn, jobController.deleteJobQual);

router
  .route("/responsibilities")
  .post(jobController.createJobResp)
  .delete(jobController.deleteJobResp);

router
  .route("/company-jobs")
  .get(jobController.addFilterCompany, jobController.getAllCompanyJobs);

//for many-to-many relationships
router.route("/mentions")
.post(jobController.createJobMentionsInterview)
.delete(jobController.deleteJobMentionsInterview);

module.exports = router;
