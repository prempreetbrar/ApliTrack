const express = require("express");
const jobController = require("../controllers/jobController");

const router = express.Router();

//do we want to add authentication here?

router.route("/details")
.post(jobController.createJob)
.delete(jobController.deleteJob)
.put(jobController.updateJob)
.get(jobController.addFilterID, jobController.getJob);

router.route("/qualifications")
.post(jobController.createJobQual)
.delete(jobController.deleteJobQual);

router.route("/responsibilities")
.post(jobController.createJobResp)
.delete(jobController.deleteJobResp);

router.route("").get(jobController.getAllJobs);

router.route("/company-jobs")
.get(jobController.addFilterCompany, jobController.getAllCompanyJobs);

//TODO: CHECK LATER FOR ERRORS (Mentions relationship)
// router.route("/mentions")
// .post(jobController.createJobMentionsInterview)
// .delete(jobController.deleteJobMentionsInterview);

module.exports = router;