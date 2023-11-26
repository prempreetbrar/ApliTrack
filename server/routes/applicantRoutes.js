const express = require("express");
const applicantController = require("../controllers/applicantController");

const router = express.Router();
router.post("/get-started", applicantController.createApplicant);

module.exports = router;
