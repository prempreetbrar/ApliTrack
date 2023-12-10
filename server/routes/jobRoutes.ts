const express = require("express");
const jobController = require("../controllers/jobController");
const authController = require("../controllers/authController");
const fs = require("fs");

const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/jobPosts");
  },
  filename: function (req, file, cb) {
    fs.readdir("./uploads/jobPosts", (err, files) => {
      cb(null, files.length + 1 + "-" + file.originalname);
    });
  },
});
const upload = multer({ storage: storage });

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

module.exports = router;
