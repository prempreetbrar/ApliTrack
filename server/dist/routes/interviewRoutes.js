"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const interviewController = require("../controllers/interviewController");
const router = express.Router();
router.post("/schedule", interviewController.createInterview);
router.delete("/delete-interview", interviewController.deleteInterview);
router.put("/update-interview", interviewController.updateInterview);
module.exports = router;
