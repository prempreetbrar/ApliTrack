const express = require("express");
const referralController = require("../controllers/referralController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/details")
.post(authController.checkIfLoggedIn, referralController.createReferral)
.delete(referralController.deleteReferral)
.put(referralController.updateReferral)
.get(referralController.filterID, referralController.getReferral);

router
.route("")
.get(referralController.getAllReferrals);

router
.route("/my-referrals")
.get(authController.checkIfLoggedIn, 
    referralController.filterApplicant, 
    referralController.getAllApplicantReferrals);

module.exports = router;