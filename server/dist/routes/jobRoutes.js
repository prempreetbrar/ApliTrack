"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const jobController = require("../controllers/jobController");
const router = express.Router();
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
module.exports = router;
