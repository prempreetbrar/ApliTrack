const express = require("express");
const jobController = require("../controllers/jobController");

const router = express.Router();

//do we want to add authentication here?

router.route("/details")
.post(jobController.createJob)
.delete(jobController.deleteJob)
.put(jobController.updateJob);

router.route("/qualifications")
.post(jobController.createJobQual)
.delete(jobController.deleteJobQual);

router.route("/responsibilities")
.post(jobController.createJobResp)
.delete(jobController.deleteJobResp);

router.route("/mentions")
.post(jobController.createJobMentionsInterview)
.delete(jobController.deleteJobMentionsInterview);

module.exports = router;