const express = require("express");
const jobController = require("../controllers/jobController");

const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ dest: "../uploads/jobPosts" });

router
  .route("")
  .post(jobController.createJob)
  .delete(jobController.deleteJob)
  .patch(
    upload.single("JobPostFile"),
    jobController.uploadJobPostFile,
    jobController.updateJob
  )
  .get(jobController.getAllJobs);

router
  .route("/qualifications")
  .post(jobController.createJobQual)
  .delete(jobController.deleteJobQual);

router
  .route("/responsibilities")
  .post(jobController.createJobResp)
  .delete(jobController.deleteJobResp);

// router.route("").get(jobController.getAllJobs);

router
  .route("/company-jobs")
  .get(jobController.addFilterCompany, jobController.getAllCompanyJobs);

module.exports = router;
