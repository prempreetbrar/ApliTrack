const express = require("express");
const jobController = require("../controllers/jobController");
const authController = require("../controllers/authController");

const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "../uploads/jobPosts" });


router
  .route("")
  .post(
    authController.checkIfLoggedIn,
    upload.single("JobPostFile"),
    jobController.uploadJobPostFile,
    jobController.createJob
  )
  .delete(authController.checkIfLoggedIn, jobController.deleteJob)
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


router.route("/responsibilities")
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


module.exports = router;
