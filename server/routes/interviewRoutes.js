const express = require("express");
const interviewController = require("../controllers/interviewController");

const router = express.Router();
router.post("/schedule", interviewController.createInterview);
router.delete("/delete-interview", interviewController.deleteInterview);

module.exports = router;