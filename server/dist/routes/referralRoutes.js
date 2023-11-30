"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const referralController = require("../controllers/referralController");
const authController = require("../controllers/authController");
const router = express.Router();
router.route("/details")
    .post(authController.checkIfLoggedIn, referralController.createReferral)
    .delete(referralController.deleteReferral)
    .put(referralController.updateReferral);
module.exports = router;
