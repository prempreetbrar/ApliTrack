"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authController = require("../controllers/authController");
const interviewController = require("../controllers/interviewController");
const router = express.Router();
/*
    For any route that comes after this, we will check if the user is loggedIn.
*/
router.use(authController.checkIfLoggedIn);
router
    .route("")
    .post(interviewController.createInterview)
    .delete(interviewController.deleteInterview)
    .patch(interviewController.updateInterview);
module.exports = router;
